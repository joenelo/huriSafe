<?php

class HomeAwayApi {
    private $ch;
    private $accessToken;
    private $tokenType;
    private $refreshToken;
    public  $responseCode;
    const AUTH_URL  = "https://ws.homeaway.com/oauth/token";
    const HTTP_POST = "POST";
    const HTTP_GET  = "GET";
    /* Enter your credentials after registering with HomeAway */
    const CLIENT_ID = "97c6a821-5e28-4500-ae42-b6adcf9c2347";
    const CLIENT_SECRET = "4ef875a4-b7ac-4bf0-8583-815aa899bb37";
    /* Enter your credentials after registering with HomeAway */
    public function __construct(){
        $this->ch = curl_init();
    }
    /*
     * Params:
     * String $url: URL you want to make request to.
     * Associative Array  $params: an array of any key => value params you need to send.
     * String $method: HTTP method for request. Set to GET by default.
     * */
    public function buildRequest($url, $params = null, $method = "GET"){
        $method   = trim(strtoupper($method));
        $this->ch = curl_init();
        curl_setopt($this->ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($this->ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($this->ch, CURLOPT_HTTPHEADER, [
                "Authorization: Bearer " . $this->accessToken,
            ]
        );
        if(is_array($params) && $method == static::HTTP_POST){
            curl_setopt($this->ch, CURLOPT_URL, $url);
            $body = http_build_query($params);
            curl_setopt($this->ch, CURLOPT_POST, 1);
            curl_setopt($this->ch, CURLOPT_POSTFIELDS, $body);
        }elseif(is_array($params)){
            $paramUrl = $url . "?";
            $paramUrl .= implode('&', array_map(function($key, $val) use($params){
                    preg_match('/^q(\d)?$/', $key, $matches, PREG_OFFSET_CAPTURE);
                    if(!empty($matches)){
                        $result = $matches[0][0];
                        $key = $result[0];
                    }
                    return urlencode($key)."=".urlencode($val);
                },
                    array_keys($params), $params)
            );
            curl_setopt($this->ch, CURLOPT_URL, $paramUrl);
        }else{
            curl_setopt($this->ch, CURLOPT_URL, $url);
        }
        return $this;
    }
    public function executeRequest($returnJson = false){
        $resp = curl_exec($this->ch);
        if(!$returnJson){
            $resp = json_decode($resp, true);
        }
        $this->responseCode = curl_getinfo($this->ch, CURLINFO_HTTP_CODE);
        return $resp;
    }
    private function encodeCredentials(){
        $rawCreds = static::CLIENT_ID . ":" . static::CLIENT_SECRET;
        return base64_encode($rawCreds);
    }
    public function authenticate(){
        curl_setopt($this->ch, CURLOPT_URL, static::AUTH_URL);
        curl_setopt($this->ch, CURLOPT_CUSTOMREQUEST, static::HTTP_POST);
        curl_setopt($this->ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($this->ch, CURLOPT_HTTPHEADER, [
                "Authorization: Basic " . $this->encodeCredentials(),
            ]
        );
        $resp = curl_exec($this->ch);
        $this->responseCode = curl_getinfo($this->ch, CURLINFO_HTTP_CODE);
        if(!$resp || $this->responseCode != 200) {
            curl_close($this->ch);
            return false;
        } else {
            $data = json_decode($resp, true);
            $this->tokenType = $data["token_type"];
            $this->accessToken  = $data["access_token"];
            $this->refreshToken = $data["refresh_token"];
            curl_close($this->ch);
            return true;
        }
    }
}

?>