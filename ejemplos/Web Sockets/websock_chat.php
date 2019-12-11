#!/usr/bin/env php
<?php

require_once('./websockets.php');

class chatServer extends WebSocketServer {
  //protected $maxBufferSize = 1048576; //1MB... overkill for an echo server, but potentially plausible for other applications.

  static protected $onlineUsers;
  static protected $usedNames;
  
  protected function process ($user, $message) {
	// El mensaje que vamos a recibir será un objeto JSON que va a tener
	// (porque lo digo yo) dos campos: type y data
	//
	$message=json_decode($message);

	if ($message->type=="HELLO") {
		// HELLO será el mensaje de entrada al chat e indicará un nombre de usuario
		// que tendremos que comprobar si está o no disponible.
		//
		// En caso de estarlo se agregará al array de usuarios para poder enviarle
		// luego los mensajes.
		//
		// En caso de no estarlo se le comunicará que el nombre no está disponible.
		//
		$userName=$message->data;

		if (!isset($this->usedNames) || !isset($this->usedNames[$userName])) {
//			$this->onlineUsers[$user]=$userName;
			
			$userMD5=$this->userMD5($user);
			$this->onlineUsers[$userMD5]["userName"]=$userName;
			$this->onlineUsers[$userMD5]["object"]=$user;
			$this->usedNames[$userName]=$userMD5;

			$out=array("type"=>"OK_HELLO","data"=>$userName);
			$out=json_encode($out);
			$this->send($user,$out);
			$this->enviarTodos($userName." ha entrado en el chat.");
		} else {
			$out=array("type"=>"ERROR_HELLO","data"=>"Ese nombre no esta disponible, elige otro.");
			$out=json_encode($out);
			$this->send($user,$out);
		}
	} else if ($message->type=="BYE") {
		// BYE será el mensaje para abandonar el chat. No es preciso proporcionar
		// datos y, de hecho, los ignoro.
		//
		// Comprobamos que el usuario está verdaderamente en el chat. Si está
		// se le envía un OK, un mensaje a todos informando de que ha salido y se
		// le saca del array.
		//
		$userMD5=$this->userMD5($user);

		if (isset($this->onlineUsers[$userMD5])) {
			$userName=$this->onlineUsers[$userMD5]["userName"];
			$this->enviarTodos($userName." ha salido del chat.");
			$out=array("type"=>"OK_BYE","data"=>"");
			$out=json_encode($out);
			$this->send($user,$out);
			unset($this->onlineUsers[$userMD5]);
			unset($this->usedNames[$userName]);
			$this->disconnect($user->socket);
		} else {
			// Si el usario no está en el chat se le envía un mensaje de error
			//
			$out=array("type"=>"ERROR_BYE","data"=>"Usuario no esta en el chat. Utilizar antes mensaje HELLO.");
			$out=json_encode($out);
			$this->send($user,$out);
		}
	} else if ($message->type=="CHAT") {
		// CHAT es el mensaje para enviar entradas a la conversación al chat.
		//
		// El texto se limita a 140 caracteres así que más vale que el cliente
		// lo controle.
		//
		$userMD5=$this->userMD5($user);

		if (isset($this->onlineUsers[$userMD5])) {
			$userName=$this->onlineUsers[$userMD5]["userName"];

			$msg=substr($message->data,0,140);
			$msg=$userName.": ".$msg;
			$out=array("type"=>"OK_CHAT","data"=>$msg);
			$out=json_encode($out);
			$this->send($user,$out);
			$this->enviarTodos($msg);
		} else {
			// Si el usario no está en el chat se le envía un mensaje de error
			//
			$out=array("type"=>"ERROR_CHAT","data"=>"Usuario no esta en el chat. Utilizar antes mensaje HELLO.");
			$out=json_encode($out);
			$this->send($user,$out);
		}
	} else if ($message->type=="WHOSTHERE") {
		// Un mensaje para saber quien está en el chat.
		//
		$userMD5=$this->userMD5($user);

		if (isset($this->onlineUsers[$userMD5])) {
			unset($userList);
			$userList=array_keys($this->usedNames);
			sort($userList);
			$out=array("type"=>"OK_WHOSTHERE","data"=>$userList);
			$out=json_encode($out);
			$this->send($user,$out);
		} else {
			// Si el usario no está en el chat se le envía un mensaje de error
			//
			$out=array("type"=>"ERROR_WHOSTHERE","data"=>"Usuario no esta en el chat. Utilizar antes mensaje HELLO.");
			$out=json_encode($out);
			$this->send($user,$out);
		}
	}
  }

  protected function connected ($user) {
    // Do nothing: This is just an echo server, there's no need to track the user.
    // However, if we did care about the users, we would probably have a cookie to
    // parse at this step, would be looking them up in permanent storage, etc.
  }
  
  protected function closed ($user) {
    // Do nothing: This is where cleanup would go, in case the user had any sort of
    // open files or other objects associated with them.  This runs after the socket 
    // has been closed, so there is no need to clean up the socket itself here.
	//
	// Dani: si el cliente está bien hecho debería enviar un BYE antes de desconectar
	// pero, por si acaso...
	//
	$userMD5=$this->userMD5($user);
	if (isset($this->onlineUsers[$userMD5])) {
		$userName=$this->onlineUsers[$userMD5]["userName"];
		enviarTodos($userName." se ha desconectado.");
		unset($this->onlineUsers[$userMD5]);
		unset($this->usedNames[$userName]);
	}
  }

  // Método para enviar un mensaje a todos los usuarios conectados
  //
  protected function enviarTodos($message) {
	  foreach ($this->onlineUsers as $individual) {
			$out=array("type"=>"BROADCAST","data"=>$message);
			$out=json_encode($out);
			$this->send($individual["object"],$out);
	  }
  }

  protected function userMD5($user) {
	  return md5(serialize($user));
  }
}

$echo = new chatServer("danigayo.info","8080");

try {
  $echo->run();
}
catch (Exception $e) {
  $echo->stdout($e->getMessage());
}