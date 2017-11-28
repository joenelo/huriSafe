<?php
//error_reporting(E_ALL);

require_once('HomeAwayApi.php');

$url = $_POST['api_url'];
$params = $_POST['params'];

$homeaway = new HomeAwayApi();
if($homeaway->authenticate()){


    $response = $homeaway->buildRequest($url, $params, "GET")->executeRequest();

    $data = array('params' => $params, 'response' => $response);

    echo json_encode($data);

}