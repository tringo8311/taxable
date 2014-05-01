<?php
//SMTP needs accurate times, and the PHP time zone MUST be set
//This should be done in your php.ini, but this is how to do it if you don't have access to that
date_default_timezone_set('Asia/Saigon');
require 'PHPMailer/PHPMailerAutoload.php';
// Validation post method
$response = new StdClass;
if(isset($_POST['fullname'])) {
  $fullName = $_POST['fullname'];
  $emailFrom = $_POST['email'];
  $phone = $_POST['phone'];
  $subject = $_POST['subject'];
  $message = $_POST['message'];

  //Create a new PHPMailer instance
  $mail = new PHPMailer();
  //Tell PHPMailer to use SMTP
  $mail->isSMTP();
  //Enable SMTP debugging
  // 0 = off (for production use)
  // 1 = client messages
  // 2 = client and server messages
  $mail->SMTPDebug = 0;
  //Ask for HTML-friendly debug output
  $mail->Debugoutput = 'html';
  //Set the hostname of the mail server
  $mail->Host = 'smtp.gmail.com';
  //Set the SMTP port number - 587 for authenticated TLS, a.k.a. RFC4409 SMTP submission
  $mail->Port = 587;
  //Set the encryption system to use - ssl (deprecated) or tls
  $mail->SMTPSecure = 'tls';
  //Whether to use SMTP authentication
  $mail->SMTPAuth = true;
  //Username to use for SMTP authentication - use full email address for gmail
  $mail->Username = "minhtri2711@gmail.com";
  //Password to use for SMTP authentication
  $mail->Password = "ngominhtri";
  //Set who the message is to be sent from
  $mail->setFrom($emailFrom, $fullName);
  //Set an alternative reply-to address
  //$mail->addReplyTo('replyto@example.com', 'First Last');
  //Set who the message is to be sent to
  $mail->addAddress('tringo8311@gmail.com', 'Tri Ngo');
  //Set the subject line
  $mail->Subject = $subject;
  //Read an HTML message body from an external file, convert referenced images to embedded,
  //convert HTML into a basic plain-text alternative body
  //$mail->msgHTML(file_get_contents('contents.html'), dirname(__FILE__));
  $mail->msgHTML($message);
  //Replace the plain text body with one created manually
  //$mail->AltBody = $message;
  //Attach an image file
  //$mail->addAttachment('images/phpmailer_mini.png');
  //send the message, check for errors
  if (!$mail->send()) {
      //echo "Mailer Error: " . $mail->ErrorInfo;
      $response->status = "failure";
      $response->message = $mail->ErrorInfo;
      $jsonResponse = json_encode($response);
  } else {
      //echo "Message sent!";
      $response->status = "success";
      $response->message = "Thanks for your message. <br/>Please allow a couple days for me to respond.";
      $jsonResponse = json_encode($response);
  }
}else{
  $response->status = "failure";
  $response->message = "Please post your data.";
  $jsonResponse = json_encode($response);
}
header('Content-Type: application/json');
print_r($jsonResponse);
?>