<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>Thank you!</title>
<!--

Highway Template

https://templatemo.com/tm-520-highway

-->
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="apple-touch-icon" href="apple-touch-icon.jpg">
    <link rel="icon" type="image/png" href="img/favicon.ico"/>
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="css/fontAwesome.css">
    <link rel="stylesheet" href="css/light-box.css">
    <link rel="stylesheet" href="css/templatemo-style.css">
    <link href="https://fonts.googleapis.com/css?family=Kanit:100,200,300,400,500,600,700,800,900" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Zilla+Slab+Highlight&display=swap" rel="stylesheet">
    <script src="js/vendor/modernizr-2.8.3-respond-1.4.2.min.js"></script>
</head>
<body style ="background-color:black;">

<center>
        <div style="padding-top:50px;">
          <h1 style= "align:center; color:white; "><b>Thank you!</b></h1>
          <a href="/index.html" ><h2 style= "align:center; color:white; "><b>Go back to landing page</b></h2></a>
</center>

<?php
  $to = "dividemars@protonmail.com";//dividemars@protonmail.com
  $subject ="neue anmeldung";
  $email = $_POST['email'];
  $wallet = $_POST['wallet'];
  $txt =   "email: ".$email ."\n ". "address: ".$wallet;


  if ($email !="" & $wallet !=""){
    mail($to,$subject,$txt);
  }


?>
</body>
</html>
