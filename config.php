<?php

// Config
$LOG_FILE     = dirname(__FILE__).'/hook.log';
$LOG_FILE_ERR = dirname(__FILE__).'/hook-error.log';
$SECRET_KEY   = 'secretkey';

// Command of each branch
$COMMANDS = array(
  'refs/heads/develop' => '', // develop br.
  'refs/heads/master'  => '', // master br.
);