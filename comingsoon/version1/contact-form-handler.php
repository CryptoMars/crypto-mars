<?php
$errors = '';
$myemail = 'to-the-mars@web15.s171.goserver.host';//<-----Put Your email address here.
if(empty($_POST['message']))
{
    $errors .= "\n Error: all fields are required";
}

$message = $_POST['message']; 



if( empty($errors))

{

$to = $myemail;

$email_subject = "Mars Claim!:";

$email_body = "$message";

$headers = "From: to-the-mars";


mail($to,$email_subject,$email_body,$headers);

//redirect to the 'thank you' page
header('Location: thanks.html');
}
?>

