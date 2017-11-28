<?php
require_once('HomeAwayApi.php');

$homeaway = new HomeAwayApi();

if($homeaway->authenticate()){
 
    echo "SUCCESSFULLY LOADED";
 }else{
    //Auth Failed
    echo "the page has failed to load";
}