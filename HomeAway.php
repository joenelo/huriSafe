<?php
require_once('HomeAwayApi.php');

$homeaway = new HomeAwayApi();

if($homeaway->authenticate()){
    //HomeAway endpoint you want to use
//    $url = 'https://ws.homeaway.com/public/search';
//
// 	$params = ['q' => 'Moab Sleeps 6', 'centerPointLatitude' => '33.04956', 'centerPointLongitude' => '-107.4562', 'distanceInKm' => '240', 'imageSize' => 'LARGE'];
//
// 	$response = $homeaway->buildRequest($url, $params, "GET")->executeRequest();
//
//    foreach($response['entries'] as $key=>$value){
//        echo $value['headline'];
//        echo $value['description'];
// }
    echo "SUCCESSFULLY LOADED";
 }else{
    //Auth Failed
    echo "the page has failed to load";
}