<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />


<body>
  <h1 style= "align:center; color:black; "><b>Thank you!</b></h1>

<?php

  $to = "soeren_maucher@web.de";
  $subject ="neue anmeldung";
  $email = $_POST['email'];
  $wallet = $_POST['wallet'];
  $txt =   $email ."\n ".$wallet;

mail($to,$subject,$txt);
//redirect to the 'thank you' page
?>
</body>
</html>
