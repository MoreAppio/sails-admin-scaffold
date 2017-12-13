<?php

/*
 * The MIT License
 *
 * Copyright (c) 2012 Allan Sun <sunajia@gmail.com>
 * Copyright (c) 2012-2014 Toha <tohenk@yahoo.com>
 * Copyright (c) 2013 WitteStier <development@wittestier.nl>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

namespace MwbExporter\Formatter\Node\Sequelize\Model;

use MwbExporter\Model\Table as BaseTable;
use MwbExporter\Formatter\Node\Sequelize\Formatter;
use MwbExporter\Writer\WriterInterface;
use MwbExporter\Object\JS;
use MwbExporter\Helper\Comment;
use Doctrine\Common\Inflector\Inflector;

class Table extends BaseTable
{

    public function strbool($value)
    {
        return $value ? 'true' : 'false';
    }

    protected function jsonify($value) 
    {
      return $this->getJSObject(sprintf('"%s"', $value), true, true);  
    }

    /**
     * Get JSObject.
     *
     * @param mixed $content    Object content
     * @param bool  $multiline  Multiline result
     * @param bool  $raw        Is raw object
     * @return \MwbExporter\Object\JS
     */
    public function getJSObject(
      $content, $multiline = true, $raw = false)
    {
        $indentation = $this->getConfig()->get(Formatter::CFG_USE_TABS) ? "\t" : ' ';
        $indentation = str_repeat(
          $indentation, $this->getConfig()->get(Formatter::CFG_INDENTATION)
        );

        return new JS($content, array(
            'multiline' => $multiline,
            'raw' => $raw,
            'indentation' => $indentation,
        ));
    }

    /**
     * (non-PHPdoc)
     * @see \MwbExporter\Model\Base::getVars()
     */
    protected function getVars()
    {
        return array_merge(parent::getVars(), array('%entity%' => strtolower($this->getModelName())));
    }

    public function writeTable(WriterInterface $writer)
    {
        switch (true) {
            case $this->isExternal():
                return self::WRITE_EXTERNAL;

            case $this->getConfig()->get(Formatter::CFG_SKIP_M2M_TABLES) && $this->isManyToMany():
                return self::WRITE_M2M;

            default:
                $writer->open($this->getTableFileName());
                $this->writeBody($writer);
                $writer->close();
                return self::WRITE_OK;
        }
    }

    /**
     * Write model body code.
     *
     * @param \MwbExporter\Writer\WriterInterface $writer
     * @return \MwbExporter\Formatter\Node\Sequelize\Model\Table
     */
    protected function writeBody(WriterInterface $writer)
    {
        $writer
            ->writeCallback(function(WriterInterface $writer, Table $_this = null) {
                if ($_this->getConfig()->get(Formatter::CFG_ADD_COMMENT)) {
                    $writer
                        ->write($_this->getFormatter()->getComment(Comment::FORMAT_JS))
                        ->write('')
                    ;
                }
            })
            ->write("{")
            ->indent()
                ->write(
                  $this->getJSObject(sprintf(
                    '"controllerBasePath": "/api/controllers",
                    "dest": "%s",
                    "target": "%s",',
                    $this->getDocument()->getCargoDir(),
                    $this->getSchema()->getName()
                  ), true, true)
                )
                ->write(
                  $this->getJSObject(sprintf('
                    "models": [{
                      "name": "%s",
                      "crud": true,
                      "isServerSidePaging": true,
                      "queryInclude": "",
                      "fields": %s,
                      "associations": %s,
                      "options": %s
                    }]',
                    Inflector::tableize($this->getModelName()),
                    $this->asModel(),
                    $this->asAssociation(),
                    $this->asOptions()
                  ), true, true))
            ->outdent()
            ->write("}");
        return $this;
    }

    // TODO
    protected function asAssociation()
    { 
      $result = $this->getAss();
      if (empty($result)) {
        $result = array(
          '"belongsTo"'=> null,
          '"hasMany"'=> null
        );
      }

      return $this->getJSObject($result);
    }

    protected function asOptions()
    {
        $result = array(
            '"timestamps"' => true,
            '"underscored"' => false,
            '"tableName"' => $this->jsonify($this->getModelName()),
            '"comment"' => $this->jsonify($this->getComment())
        );
        return $this->getJSObject($result);
    }

    protected function asModel()
    {
        $result = $this->getFields();

        return $this->getJSObject($result);
    }

    protected function getAss() {
      $result = array();
      $belongsTo = array();
      $hasMany = array();
      $c = array();

      echo sprintf('! now Table is "%s" .'. "\n", $this->getModelName());
      // 處理多對多
      if ($this->isManyToMany()) {
        $belongsToMany = array();
        $table = array();
        echo sprintf("\n======================\n");
        echo sprintf('! Table "%s" is many to many.'. "\n", $this->getModelName());
        echo sprintf("----------------------\n");
        foreach ($this->getAllForeignKeys() as $foreignKey) {
          # code...
          echo sprintf('! Table Foreign Key is "%s", table is "%s".'. "\n", 
            $foreignKey->getForeign()->getColumnName(),
            $foreignKey->getForeign()->getTable()->getModelName()
          );
          echo sprintf('! Table Local Key is "%s", table is "%s".'. "\n", 
            $foreignKey->getLocal()->getColumnName(),
            $foreignKey->getForeign()->getTable()->getModelName()
          );
          $table = $this->jsonify(
            Inflector::classify($foreignKey->getForeign()->getTable()->getModelName())
          );
          array_push($belongsToMany, $table);
        }
        echo sprintf("----------------------\n");
        echo sprintf("======================\n\n");
        $c['"belongsToMany"'] = $belongsToMany;
        return $c;
      }

      // 處理關聯
      foreach ($this->getForeignKeys() as $key) {
        # code...
        echo sprintf('! LocalM2MRelatedName: %s, ForeignM2MRelatedName: %s'. "\n",
          $key->getLocalM2MRelatedName(),
          $key->getForeignM2MRelatedName()
        );
        foreach ($key->getLocals() as $localKey) {
          # code...
          foreach ($key->getForeigns() as $foreign) {
            echo sprintf('! OwningTable ModelName %s -------> ReferencedTable ModelName %s'. "\n", 
              $key->getOwningTable()->getModelName(),
              $key->getReferencedTable()->getModelName()
            );
            # code...
            echo sprintf('! local key %s.%s -------> %s.%s (%s)'. "\n", 
              $key->getOwningTable()->getModelName(),
              $localKey->getColumnName(),
              $key->getReferencedTable()->getModelName(),
              $foreign->getColumnName(),
              $key->isManyToOne() ? 'ManyToOne' : 'Not ManyToOne'
            );
            if ($key->isManyToOne()) {
              $item = $this->jsonify(
                Inflector::classify($key->getReferencedTable()->getModelName())
              );
            // if (substr($name, -2) === 'id') {
            //   $name = Inflector::classify($column->getColumnName());
            // }
              $hasMany = array();
              array_push($hasMany, $item);
            } else {
              $item = $this->jsonify(
                Inflector::classify($key->getReferencedTable()->getModelName())
              );
              array_push($belongsTo, $item);
            }
          }
        }
      }
      if (!empty($belongsTo)) {
        $c['"belongsTo"'] = $belongsTo;
      }
      if (!empty($hasMany)) {
        $c['"hasMany"'] = $hasMany;
      }
      if (!empty($c)) {
        array_push($result, $c);
      }
      return $c;
    }

    /**
     * Get model fields.
     *
     * @return array
     */
    protected function getFields()
    {
        $result = array();
        foreach ($this->getColumns() as $column)
        {
          $type = $this->getFormatter()->getDatatypeConverter()->getType($column);
          $firstLetter = substr($column->getColumnName(), 0, 1);
          $last2Letters = substr($column->getColumnName(), -2);
          $isIdField = ($column->getColumnName() === 'id' && $column->isPrimary() && $type !== 'CHAR');
          $isRelationId = (strtolower($last2Letters) === 'id' && strtoupper($firstLetter) == $firstLetter);
          $isDateField = (strtolower($last2Letters) === 'at' && $type === 'DATE');
          // echo sprintf('! isIdField: "%s", isRelationId: "%s".'. "\n", 
          //   $this->strbool(!$isIdField), 
          //   $this->strbool(!$isRelationId));
// !$isIdField
        if (!$isRelationId && !$isDateField) 
          {
            $c = array();
            //  取出欄位名稱
            $name = $column->getColumnName();
            $c['"name"'] = $this->jsonify($name);
            
            // 取出欄位類型
            $c['"type"'] = $this->jsonify($type);
            // $this->getJSObject(sprintf('"%s"', $type ? $type : 'STRING.BINARY'), true, true);
            // echo sprintf('! type: "%s".'. "\n", $c['"type"']);

            // 取出 ENUM 參數
            if ($type === 'ENUM') {
              $param = $column->getExplicitParams();
              // echo sprintf('! ExplicitParams: "%s".', $param);
              // $param = str_replace("'", "\"", $param);
              $param = str_replace("(", "[", $param);
              $param = str_replace(")", "]", $param);
              $c['"param"'] = $this->jsonify($param);
            }
            $c['"allowNull"'] = !$column->isNotNull();

            // 取出 comment
            $c['"comment"'] = $this->jsonify($column->getComment());
            // echo sprintf('! comment: "%s".'. "\n", $layout['"comment"']);

            // 組合表單顯示的欄位名稱
            $layout = array();
            $layout['"label"'] = $this->jsonify($column->getColumnName());
            $c['"layout"'] = $layout;

            if ($column->isPrimary()) {
                $c['"primaryKey"'] = true;
            }
            if ($column->isAutoIncrement()) {
                $c['"autoIncrement"'] = true;
            }
            if ($column->isUnique()) {
              $c['"unique"'] = true;
            }
            if ($column->getLength() > 0) {
              $c['"length"'] = $column->getLength();
            }
            if ($column->getDefaultValue()) {
              $isBool = $column->getDefaultValue() === 'true' || 
                $column->getDefaultValue() === 'false';
              if ($type === 'STRING' || $type === 'ENUM') {
                $defaultValue = $this->jsonify($column->getDefaultValue());
              } else if ($type === 'INTEGER'){
                $defaultValue = intval($column->getDefaultValue());
              } else if ($isBool) {
                $defaultValue = ($column->getDefaultValue() === 'true');
              }
              // echo sprintf('! type: "%s", final DefaultValue: `%s`.'. "\n", $type, $defaultValue);
              $c['"default"'] = $defaultValue;
            }
            array_push($result, $c);
          }
        }
        return $result;
    }
}