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
                  $this->getJSObject(sprintf('
                    "controllerBasePath": "/api/controllers",
                    "dest": "exported",
                    "target": "%s",', $this->getSchema()->getName()
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
                    $this->getModelName(),
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
            '"tableName"' => $this->jsonify($this->getModelName())
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

      if ($this->isManyToMany()) {
        echo sprintf('! Table "%s" is many to many.'. "\n", $this->getModelName());
        return $result;
      }
      foreach ($this->getForeignKeys() as $key) {
        # code...
        echo sprintf('! LocalM2MRelatedName: %s, ForeignM2MRelatedName: %s'. "\n",
          $key->getLocalM2MRelatedName(),
          $key->getForeignM2MRelatedName()
        );
        foreach ($key->getLocals() as $localKey) {
          # code...
          foreach ($key->getForeigns() as $foreign) {
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
          $firstLetter = substr($column->getColumnName(), 0, 1);
          $last2Letters = substr($column->getColumnName(), -2);
          $isIdField = ($column->getColumnName() == 'id' && $column->isPrimary());
          $isRelationId = ($last2Letters == 'id' && strtoupper($firstLetter) == $firstLetter);
          echo sprintf('! isIdField: "%s", isRelationId: "%s".'. "\n", 
            $this->strbool(!$isIdField), 
            $this->strbool(!$isRelationId));

          if (!$isIdField && !$isRelationId) 
          {
            $type = $this->getFormatter()->getDatatypeConverter()->getType($column);
            $c = array();
            $name = $column->getColumnName();
            $c['"name"'] = $this->jsonify($name);
            $c['"type"'] = $this->getJSObject(sprintf('"%s"', $type ? $type : 'STRING.BINARY'), true, true);
            $c['"default"'] = $this->jsonify($column->getDefaultValue());  
            $c['"allowNull"'] = !$column->isNotNull();

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
            array_push($result, $c);
          }
        }
        return $result;
    }
}