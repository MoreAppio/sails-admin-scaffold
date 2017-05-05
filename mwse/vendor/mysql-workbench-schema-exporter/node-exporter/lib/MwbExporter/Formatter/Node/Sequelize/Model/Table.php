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

class Table extends BaseTable
{
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
                      "fields": %s
                    }]', 
                    $this->getModelName(),
                    $this->asModel()
                  ), true, true))
            ->outdent()
            ->write("}")
        ;

        return $this;
    }

    // TODO
    protected function asAssociation()
    {
      $result = array();
      // foreach ($this->getColumns() as $column)
      // {
      //     $c = array();
      //     $pos = strpos($column->getColumnName(), "_id");

      //     if ($pos !== false) {
      //       $modelName = $column->getColumnName();
      //       "%s."
      //     }

      //     $type = $this->getFormatter()->getDatatypeConverter()->getType($column);
      //     $c = array();
      //     $c['type'] = $this->getJSObject(sprintf('DataTypes.%s', $type ? $type : 'STRING.BINARY'), true, true);
      //     if ($column->isPrimary()) {
      //         $c['primaryKey'] = true;
      //     }
      //     if ($column->isAutoIncrement()) {
      //         $c['autoIncrement'] = true;
      //     }
      //     $result[$column->getColumnName()] = $c;
      // }

      return $this->getJSObject($result);
    }

    protected function asOptions()
    {
        $result = array(
            'timestamps' => true,
            'underscored' => false,
            'tableName' => $this->getRawTableName()
        );

        return $this->getJSObject($result);
    }

    protected function asModel()
    {
        $result = $this->getFields();

        return $this->getJSObject($result);
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
          if ($column->getColumnName() !== 'id') {
            $type = $this->getFormatter()->getDatatypeConverter()->getType($column);
            $c = array();
            $c['"type"'] = $this->getJSObject(sprintf('"%s"', $type ? $type : 'STRING.BINARY'), true, true);
            $c['"name"'] = $this->getJSObject(sprintf('"%s"', $column->getColumnName()), true, true);

            $length = $column->getLength();
            if ($length < 0) $length = 11;
            $c['"length"'] = $this->getJSObject(sprintf('"%s"', $length), true, true);

            if ($column->isPrimary()) {
                $c['"primaryKey"'] = true;
            }
            if ($column->isAutoIncrement()) {
                $c['"autoIncrement"'] = true;
            }
            
            $layout = array();
            $layout['"label"'] = $this->getJSObject(sprintf('"%s"', $column->getColumnName()), true, true);
            $c['"layout"'] = $layout;
            array_push($result, $c);
          }
        }

        return $result;
    }
}