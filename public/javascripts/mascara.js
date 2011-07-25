var sUserAgent = navigator.userAgent;
var fAppVersion = parseFloat(navigator.appVersion);

var isOpera = sUserAgent.indexOf("Opera") > -1;
var isKHTML = sUserAgent.indexOf("KHTML") > -1
	|| sUserAgent.indexOf("Konqueror") > -1
	|| sUserAgent.indexOf("AppleWebKit") > -1;
if (isKHTML) {
	isSafari = sUserAgent.indexOf("AppleWebKit") > -1;
	isKonq = sUserAgent.indexOf("Konqueror") > -1;
}
var isIE = sUserAgent.indexOf("compatible") > -1
	&& sUserAgent.indexOf("MSIE") > -1
	&& !isOpera;
var isMoz = sUserAgent.indexOf("Gecko") > -1
	&& !isKHTML;

// Tempo utilizado para espera da mensagem de erro
var ERRO_TIMEOUT = 4000;

function fade(campo) {
	var c = document.getElementById(campo);
	c.style.display = 'none';
}

function StringBuffer() {
this.__strings__ = [];
}

StringBuffer.prototype.append = function (str) {
this.__strings__.push(str);
};

StringBuffer.prototype.toString = function () {
return this.__strings__.join("");
};

function externalLinks() {
	if (!document.getElementsByTagName) {return;}
	var anchors = document.getElementsByTagName('a');
	for (var i = 0; i < anchors.length; i++) {
		var anchor = anchors[i];
		if (anchor.getAttribute("href") &&
				anchor.getAttribute("rel") == "external") {
			anchor.target = '_blank';
		}
	}
}

if (!isIE) {
	Document.prototype.readyState = 0;
	//Document.prototype.onreadystatechange = null;

	Document.prototype.__changeReadyState__ = function (iReadyState) {
		this.readyState = iReadyState;
		if (typeof this.onreadystatechange == "function") {
			this.onreadystatechange();
		}
	};

	Document.prototype.loadXML = function (sXml) {
		this.__changeReadyState__(1);
		var oParser = new DOMParser();
		var oXmlDom = oParser.parseFromString(sXml, "text/xml");
		while (this.firstChild) {
			this.removeChild(this.firstChild);
		}
		for (var i=0; i < oXmlDom.childNodes.length; i++) {
			var oNewNode = this.importNode(oXmlDom.childNodes[i], true);
			this.appendChild(oNewNode);
		}
		this.__changeReadyState__(4);
	};
}

function mascaraCnpjouCpf(num){
	numero = num.replace('.','');
	numero = numero.replace('.','');
	numero = numero.replace('.','');
	numero = numero.replace('-','');
	numero = numero.replace('/','');
	//alert(numero);
	if(numero.length > 11){
		return mascara_global('##.###.###/####-##', num);
	}else{
		 return mascara_global('###.###.###-##', num);
	}
}

function validaProposta(object){
		var numProposta = object.value;
		numProposta = numProposta.replace(".","");
		numProposta = numProposta.replace(".","");
		numProposta = numProposta.replace("-","");

		if(numProposta != '' && numProposta.length != 16) {
			alert("Proposta não cadastrada no SIOPI.");
			object.focus();
			return false;
		} else if(numProposta != '') {
			var dvNum = numProposta.charAt(15);
			var soma = 0;
			var multiplicador = 2;
			for (var i = 14; i >= 0; i--) {
				soma += parseInt(numProposta.charAt(i)) * multiplicador;
				multiplicador++;
				if (multiplicador == 10) {
					multiplicador = 2;
				}
			}

			var resto = soma % 11;
			if (resto == 0 || resto == 1) {
				DV = 0;
			} else {
				DV = 11 - parseInt(resto);
			}
			if (DV != dvNum){
				alert("Dígito verificador não confere. Verifique o número da proposta.");
				object.focus();
				return false;
			}
			return true;
		}
}


function createXMLDOM() {
	if (window.ActiveXObject) {
		var arrSignatures = ["MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument", "Microsoft.XmlDom"];
		for (var i=0; i < arrSignatures.length; i++) {
			try {
				return new ActiveXObject(arrSignatures[i]);
			} catch (oError) {
				//ignore
			}
		}
		throw new Error("MSXML is not installed on your system.");
	} else if (document.implementation && document.implementation.createDocument) {
		var oXmlDom = document.implementation.createDocument("","",null);
		oXmlDom.addEventListener("load", function () {
			this.__changeReadyState__(4);
		}, false);
		return oXmlDom;
	} else {
		throw new Error("Your browser doesn't support an XML DOM object.");
	}
}

function AjaxConnect() {
	// Cria o objeto XMLHttpRequest
	this.criaxmlhttp = function() {
		try {
	   		// Safari, Firefox, Konqueror
			this.xmlhttp = new XMLHttpRequest();
			this.xmlhttp.overrideMimeType('text/xml');
		} catch(ee) {
			try {
				// IE4-
				this.xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
			} catch(e) {
				try {
					// IE 5+
					this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
				} catch(E) {
					throw 'Erro ao instanciar o objeto XMLHTTP';
				}
			}
		}
	};

	this.getstatechange = function(req, processaRetorno) {
		statechange = function() {
			// Verifica se o servidor enviou a resposta de forma correta
			try {
				if (req.readyState == 4) {
					if (req.status == 200) {
						processaRetorno(req.responseXML);
					} else if (req.status == 500) {
						a = createXMLDOM();
						a.async = false;
						a.loadXML("<root><error>Erro ao processar a requisição XML.</error></root>");
						processaRetorno(a);
					} else if (req.status == 404) {
						a = createXMLDOM();
						a.async = false;
						a.loadXML("<root><error>Página não encontrada.</error></root>");
						processaRetorno(a);
					} else {
						a = createXMLDOM();
						a.async = false;
						a.loadXML("<root><error>Erro desconhecido.</error></root>");
						processaRetorno(a);
					}
				}
			} catch(e) {
				if (e.name == 'NS_ERROR_NOT_AVAILABLE') {
					//alert('Servidor de aplicação indisponível.');
					a = createXMLDOM();
					a.async = false;
					a.loadXML("<root><error>Servidor de aplicação indisponível.</error></root>");
					processaRetorno(a);
				} else {
					//alert('Erro de Javascript: ' + e.name);
					throw e;
				}
			}
		};
		return statechange;
	};

	this.enviar = function(url, valores, processaRetorno) {
		try {
			this.criaxmlhttp();
			this.xmlhttp.open('GET', url + '?' + valores, true);
			this.xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			this.xmlhttp.setRequestHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
			this.xmlhttp.onreadystatechange=this.getstatechange(this.xmlhttp, processaRetorno);
			this.xmlhttp.send(null);
		} catch(e) {
			alert(e);
		}
	}
}

function AjaxResponseText() {
	// Cria o objeto XMLHttpRequest
	this.criaxmlhttp = function() {
		try {
	   		// Safari, Firefox, Konqueror
			this.xmlhttp = new XMLHttpRequest();
			this.xmlhttp.overrideMimeType('text/xml');
		} catch(ee) {
			try {
				// IE4-
				this.xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
			} catch(e) {
				try {
					// IE 5+
					this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
				} catch(E) {
					throw 'Erro ao instanciar o objeto XMLHTTP';
				}
			}
		}
	};

	this.getstatechange = function(req, processaRetorno) {
		statechange = function() {
			// Verifica se o servidor enviou a resposta de forma correta
			try {
				if (req.readyState == 4) {
					if (req.status == 200) {
						processaRetorno(req.responseText);
					} else if (req.status == 500) {
						a = createXMLDOM();
						a.async = false;
						a.loadXML("<root><error>Erro ao processar a requisição XML.</error></root>");
						processaRetorno(a);
					} else if (req.status == 404) {
						a = createXMLDOM();
						a.async = false;
						a.loadXML("<root><error>Página não encontrada.</error></root>");
						processaRetorno(a);
					} else {
						a = createXMLDOM();
						a.async = false;
						a.loadXML("<root><error>Erro desconhecido.</error></root>");
						processaRetorno(a);
					}
				}
			} catch(e) {
				if (e.name == 'NS_ERROR_NOT_AVAILABLE') {
					//alert('Servidor de aplicação indisponível.');
					a = createXMLDOM();
					a.async = false;
					a.loadXML("<root><error>Servidor de aplicação indisponível.</error></root>");
					processaRetorno(a);
				} else {
					//alert('Erro de Javascript: ' + e.name);
					throw e;
				}
			}
		};
		return statechange;
	};

	this.enviar = function(url, valores, processaRetorno) {
		try {
			this.criaxmlhttp();
			this.xmlhttp.open('GET', url + '?' + valores, true);
			this.xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			this.xmlhttp.setRequestHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
			this.xmlhttp.onreadystatechange=this.getstatechange(this.xmlhttp, processaRetorno);
			this.xmlhttp.send(null);
		} catch(e) {
			alert(e);
		}
	}
}

/* *********************************************************************************************************
 * FUNÇÃO         = boolean estaPreenchido(Campo, Label);
 * AUTOR          = rogerm
 * DT_CRIACAO     = 06/11/2001
 * OBJETIVO       = Verifica se o campo está preenchido.
 * EXEMPLO DE USO = if(!estaPreenchido(getCampo(Form, this.Form.nomeDoCampo), "LabeldoCampo")){
 *                    alert("O campo não está preemchido." return false;);
 *                  }
********************************************************************************************************* */
function estaPreenchido(Campo, Label){
  var tipo = "";

  if(typeof(Campo.length) == "number"){
    if(typeof(Campo.type) == "string"){
      tipo = Campo.type;
    }
    else{
      tipo = Campo[0].type;
    }
  }
  else{
    tipo = Campo.type;
  }

  if (tipo == "text" || tipo == "password") {
    if(Campo.value == ""){
      return selecaoObrigatoria(Campo, Label);
    }
  }
  else if (tipo == "checkbox") {
    if(retornaQuantidadeSelecionado(Campo) == 0){
      return selecaoObrigatoria(Campo, Label);
    }
  }
  else if (tipo == "radio") {
    if(retornaQuantidadeSelecionado(Campo) == 0){
      return selecaoObrigatoria(Campo, Label);
    }
  }
  else if (tipo.substr(0, 6) == "select") {
    if(!comboSelecionado(Campo)){
      return selecaoObrigatoria(Campo, Label);
    }
  }
  else if (tipo == "file") {
    if(Campo.value == ""){
      return selecaoObrigatoria(Campo, Label);
    }
  }
  else if (tipo == "hidden") {
    if(Campo.value == "" || Campo.value == null){
      alert("O Campo "+Label+" é de Preenchimento Obrigatório.");
      return false;
    }
  }
  else if (tipo == "button") {
    //alert(Label+" = button");
  }
  else if (tipo == "submit") {
    //alert(Label+" = submit");
  }
  else if (tipo == "reset") {
    //alert(Label+" = reset");
  }

  return true;
}

/* *********************************************************************************************************
 * FUNCAO         = void txtPressNumber(campo)
 * AUTOR          = anilton.maciel
 * DT_CRIACAO     = 06/02/2007
 * OBJETIVO       = Permite a entrada somente de valores numéricos no campos texto.
 * EXEMPLO DE USO =
 * <input type="text" name="campoNumero" value="" onkeypress="txtPressNumber(this);">
 ********************************************************************************************************* */
function txtPressNumber(field) {
	var key = event.keyCode;

	if(key < 48 || key > 57) {
	    event.keyCode = 0;
		return;
	}
}

/* *********************************************************************************************************
 * FUNÇÃO         = boolean selecaoObrigatoria(Campo, Label);
 * AUTOR          = rogerm
 * DT_CRIACAO     = 06/11/2001
 * OBJETIVO       = Retorna o foco para o campo obrigatório e emite uma mensagem de erro.
 * EXEMPLO DE USO = return selecaoObrigatoria(this.form.nomeDoCampo, "LabeldoCampo");
********************************************************************************************************* */
function selecaoObrigatoria(Campo, Label){
  alert("O Campo "+Label+" é de Preenchimento Obrigatório.");
  if(typeof(Campo.length) == "number"){
    if(typeof(Campo.type) == "string"){
      Campo.focus();
    }
    else{
      Campo[0].focus();
    }
  }
  else{
    Campo.focus();
  }
  return false;
}

/* *********************************************************************************************************
 * FUNÇÃO         = number retornaQuantidadeSelecionado(radio/checbox)
 * AUTOR          = rogerm
 * DT_CRIACAO     = 07/11/2001
 * OBJETIVO       = Retorna a quantidade de itens selecionados de um radioButton ou checkBox .
 * EXEMPLO DE USO = if(retornaQuantidadeSelecionado(this.form.nomeDoCampo) == 0){
 *                    alert("O campo não está selecionado.");
 *                    return false;
 *                  }
********************************************************************************************************* */
function retornaQuantidadeSelecionado(Campo){

  var campoChecado = 0;
  if(typeof(Campo.length) == "number"){
    for (var i = 0; i < Campo.length; i++) {
      if (Campo[i].checked == true){
        campoChecado ++;
      }
    }
  }
  else{
    if(Campo.checked){
      campoChecado ++;
    }
  }

  return campoChecado;
}

/* *********************************************************************************************************
 * FUNÇÃO         = boolean comboSelecionado(Select)
 * AUTOR          = rogerm
 * DT_CRIACAO     = 06/11/2001
 * OBJETIVO       = Verifica se existe algum valor selecionado na combo.
 * EXEMPLO DE USO = if(!comboSelecionado(this.form.nomeDoCampo)){
 *                    alert("Combo não está selecionada.");
 *                    return false;
 *                   }
********************************************************************************************************* */
function comboSelecionado(Combo){

  for(var i=0; i < Combo.length; i++) {
    if(Combo.options[i].selected && Combo.options[i].value != "") {
	return true;
    }
  }

 return false;

}

// Script: trim
// Função: remove os espaços em branco que estiverem no início ou no final da string
// Uso   : <input onblur="this.value = trim(this.value)">
/*
function trim(str)
{
  if (str.charAt(0) == ' ')
    str = trim(str.substr(1));
  if (str.charAt(str.length - 1) == ' ')
    str = trim(str.substr(0, str.length - 1));
  return str;
}
*/
function trim(s) {
  return s.replace( /^\s*/, "" ).replace( /\s*$/, "" );
}

/* *********************************************************************************************************
 * FUNÇÃO         = String retiraCaracteresSeparacao(Str)
 * AUTOR          = rogerm
 * DT_CRIACAO     = 08/11/2001
 * OBJETIVO       =
 * Retira caracteres de separação de uma String, ("/", "-", ".", ",", ";", "|", " ", "\", ":", "(", ")").
 * EXEMPLO DE USO = "12122001" = retiraCaracteresSeparacao("12-12.2001");
********************************************************************************************************* */
function retiraCaracteresSeparacao(Str) {
  var s = "";
  var espaco = "X X";
  Str = trim(Str);
  for (i = 0; i < Str.length ; i++) {
    if (Str.charAt(i) != "/" && Str.charAt(i) != "-" && Str.charAt(i) != "."  && Str.charAt(i) != "," &&
        Str.charAt(i) != ";" && Str.charAt(i) != "|" && Str.charAt(i) != espaco.charAt(1) && Str.charAt(i) != "\\" &&
        Str.charAt(i) != ":" && Str.charAt(i) != "(" && Str.charAt(i) != ")"){
      s = s + Str.charAt(i);
    }
  }
  return s;
}

/* *********************************************************************************************************
 * FUNÇÃO         = boolean eDataValida(Str)
 * AUTOR          = rogerm
 * DT_CRIACAO     = 08/11/2001
 * OBJETIVO       = Verifica se a String passada como parametro é uma dada valida - formato dd/mm/yyyy.
 * EXEMPLO DE USO = if(!eDataValida("12/12/2001")){ alert("Data inválida"); return false;}
********************************************************************************************************* */
function eDataValida(Str) {
    vlraux = trim(Str);
    if ((vlraux == "") || (vlraux.length != 10) ||
       (vlraux.charAt(2) != "/") || (vlraux.charAt(5)!= "/")){
       return false;
    }

    dia = parseInt(vlraux.substring(0,2),10);
    mes = parseInt(vlraux.substring(3,5),10);
    ano = parseInt(vlraux.substring(6,10),10);

	if(ano < 1840)
		return false;

    if (isNaN(dia) || isNaN(mes) || isNaN(ano) || (mes < 1) || (mes > 12) || (dia < 1)) {
      return false;
    }

    tabmes = "312831303130313130313031";

    if ((dia == 29) && (mes == 2)){
      if ((ano == 0) || ((ano % 4) != 0)){
        return false;
      }
      else { return true; }
    }

    k = (mes * 2 - 2);

    if (dia > tabmes.substring(k,k + 2)) {
      return false;
    }
    else { return true;}

   return false;
}

/* *********************************************************************************************************
 * FUNÇÃO         = void formataData(Campo)
 * AUTOR          = rogerm
 * DT_CRIACAO     = 08/11/2001
 * OBJETIVO       = Coloca o valor de um campo do tipo text no formato dd/mm/yyyy e
 *                  verifica se é uma dada válida.
 * EXEMPLO DE USO = <input type="text" value"" name="dataTeste" onBlur="JavaScript: formataData(this);">
********************************************************************************************************* */
function formataData(Campo) {
  if(Campo.value != ""){
    Campo.value = retiraCaracteresSeparacao(Campo.value);
    vr = Campo.value;
    tam = vr.length;

    if ( tam > 2 && tam < 5 )
            Campo.value = vr.substr( 0, tam - 2) + "/" + vr.substr( tam - 2, tam );
    if ( tam >= 5 && tam <= 10 )
            Campo.value = vr.substr( 0, 2 ) + "/" + vr.substr( 2, 2 ) + "/" + vr.substr( 4, 4 );

    if (!eDataValida(Campo.value)) {
	  alert("Data Inválida.");
	  Campo.value = "";
	  Campo.focus();
	 }
  }
}

function formataDataSemAlert(Campo) {

	if(Campo.value != ""){
	    Campo.value = retiraCaracteresSeparacao(Campo.value);
	    vr = Campo.value;
	    tam = vr.length;

	    if ( tam > 2 && tam < 5 )
	            Campo.value = vr.substr( 0, tam - 2) + "/" + vr.substr( tam - 2, tam );
	    if ( tam >= 5 && tam <= 10 )
	            Campo.value = vr.substr( 0, 2 ) + "/" + vr.substr( 2, 2 ) + "/" + vr.substr( 4, 4 );

	  }
}

function validaData(Campo) {
  if(Campo.value != ""){
    Campo.value = retiraCaracteresSeparacao(Campo.value);
    vr = Campo.value;
    tam = vr.length;

    if ( tam > 2 && tam < 5 )
            Campo.value = vr.substr( 0, tam - 2) + "/" + vr.substr( tam - 2, tam );
    if ( tam >= 5 && tam <= 10 )
            Campo.value = vr.substr( 0, 2 ) + "/" + vr.substr( 2, 2 ) + "/" + vr.substr( 4, 4 );

    if (!eDataValida(Campo.value)) {
	  alert("O valor informado não corresponde a uma data.");
	  Campo.value = "";
	  Campo.focus();
	 }

  }
}

function verificaDataValida(Campo, mensagem) {
	  if(Campo.value != ""){

	    Campo.value = retiraCaracteresSeparacao(Campo.value);
	    vr = Campo.value;
	    tam = vr.length;

	    if ( tam > 2 && tam < 5 )
	            Campo.value = vr.substr( 0, tam - 2) + "/" + vr.substr( tam - 2, tam );
	    if ( tam >= 5 && tam <= 10 )
	            Campo.value = vr.substr( 0, 2 ) + "/" + vr.substr( 2, 2 ) + "/" + vr.substr( 4, 4 );

	    return eDataValida(Campo.value);

	  }
	}

/* *********************************************************************************************************
 * FUNÇÃO         = boolean eNumero(Char)
 * AUTOR          = rogerm
 * DT_CRIACAO     = 08/11/2001
 * OBJETIVO       = Veriica se o caracter passado como parametro é um numero.
 * EXEMPLO DE USO = var numero = "123a456";
 *                  if(!eNumero(numero.charAt(3))){ alert("O caracter não é um número");}
********************************************************************************************************* */
function eNumero(Char){
  numeros = "0,1,2,3,4,5,6,7,8,9";
  arrayNumeros = numeros.split(",");
  for(i=0; i < arrayNumeros.length; i++){
   if(Char == arrayNumeros[i]){
     return true;
   }
  }
  return false;
}

/* *********************************************************************************************************
 * FUNÇÃO         = boolean eNumerico(Str)
 * AUTOR          = eduardoa
 * DT_CRIACAO     = 08/11/2001
 * OBJETIVO       = Veriica se a String passada como parametro é um numero.
 * EXEMPLO DE USO = var numero = "123a456";
 *                  if(!eNumerico(numero)){ alert("A String não é um número");}
********************************************************************************************************* */
function eNumerico(Valor){
  for(j=0; j < Valor.length; j++){
    if(!eNumero(Valor.charAt(j))){
      return false;
    }
  }
  return true;
}

/* *********************************************************************************************************
 * FUNÇÃO         = String imprimeInteiro(Str)
 * AUTOR          = rogerm
 * DT_CRIACAO     = 08/11/2001
 * OBJETIVO       = Format a String para a mascara de numero - 99.999.999
 * EXEMPLO DE USO = "99.999" == imprimeInteiro("99999");
********************************************************************************************************* */
function imprimeInteiro(Str) {

  var resultado = "";
  if(Str.length > 3){
    var count = 0;
    for (i = (Str.length - 1); i >= 0 ; i--) {
      if(count == 3){
        resultado = "." + resultado;
        count = 0;
      }

      resultado = Str.charAt(i) + resultado;
      count++;

    }
    return resultado;
  }
  else{
    return Str;
  }
}

/* *********************************************************************************************************
 * FUNÇÃO         = boolean eCgcValido(Str)
 * AUTOR          = rogerm
 * DT_CRIACAO     = 09/11/2001
 * OBJETIVO       = Verifica se a String passada como parametro é um CGC válido -formato- 99.999.999/9999-99
 * EXEMPLO DE USO = if(!eCgcValido("99.999.999/9999-99")){ alert("CGC inválido"); return false;}
********************************************************************************************************* */
function eCgcValido(Str) {

  var arg   = retiraCaracteresSeparacao(Str);
  c = trim(arg);
  t = arg.length;
  ax = "";
  dv = "";
  dv1 = 0;
  dv2 = 0;

  if (t < 14) {return false;}

  while(t < 14) {
    ax += "0";
    t++;
  }

  c = ax+c;
  sm1 = 0;
  sm2 = 0;
  peso = 6;

  for (i=0;i<=11; i++){
    if (i >= 4) {
      i==4 ? peso=9 : peso-- ;
    }
    else { peso--; }

    sm1+=c.substring(i,i+1)*peso;
  }

  peso = 7;

  for (i=0;i<=12; i++){
    if (i>=5) {
      i==5 ? peso=9 : peso-- ;
    }
    else {peso--;}

    sm2+=c.substring(i,i+1)*peso;
  }

  t = 11 - sm1%11;
  t < 10 ? dv1=t : dv1=0;
  t = 11 - sm2%11;
  t < 10 ? dv2=t : dv2=0;

  if ((c.substring(12,13)==dv1)&&(c.substring(13,14)==dv2)) {
    return true;
  } else { return false; }
}

/* *********************************************************************************************************
 * FUNÇÃO         = void formataNumero(Campo, Tamanho, Precisao)
 * AUTOR          = rogerm
 * DT_CRIACAO     = 12/11/2001
 * OBJETIVO       = Verifica se o valor digitado em uma text é um numero.
 * EXEMPLO DE USO =
 * <input type="text" name="campoNumero" value="" onBlur="JavaScript: formataNumero(this, 5);"> - 99.999
 * <input type="text" name="campoNumero" value="" onBlur="JavaScript: formataNumero(this, 7, 2);"> - 99.999,99
********************************************************************************************************* */
function formataNumero(Campo, Tamanho, Precisao){
  if(Campo.value != ""){
    var numero = retiraCaracteresSeparacao(Campo.value);

    if (eNumerico(numero)) {
      if(numero == 0){
	alert("Numero inválido.");
        Campo.value = "";
        Campo.focus();
        return false;
      }

      if(numero.length > Tamanho){
        alert("O Campo Só Permite "+ Tamanho +" Digitos.");
        Campo.value = "";
        Campo.focus();
        return false;
      }

      if(Precisao == null){
        Campo.value = imprimeInteiro(numero);
      }
      else{
        if (Campo.value.indexOf(",") == -1) {
          if(numero.length > (Tamanho - Precisao) ) {
            alert("O Campo Só Permite "+ (Tamanho - Precisao) +" Digitos na Parte Inteira.");
            Campo.value = "";
            Campo.focus();
            return false;
          }
          Campo.value = imprimeInteiro(numero) + ",";
	  for(num = 0; num < Precisao; num++){
	    Campo.value += "0";
	  }
        }
        else {
          var inteiro = Campo.value.substring(0, Campo.value.indexOf(","));
          inteiro = retiraCaracteresSeparacao(inteiro);
          inteiro = imprimeInteiro(inteiro);

          var fracao = Campo.value.substr((Campo.value.indexOf(",") + 1), Precisao);
          fracao = retiraCaracteresSeparacao(fracao);

          if (fracao.length != Precisao) {
            for (i = fracao.length; i != Precisao; i++) {
              fracao += "0";
            }
          }
          Campo.value = inteiro + "," + fracao;
        }
      }
    } else {
      alert("Digite Somente Números no Campo.");
      Campo.value = "";
      Campo.focus();
    }
  }
}

/* *********************************************************************************************************
 * FUNÇÃO         = number comparaDatas(Data1, Data2)
 * AUTOR          = rogerm
 * DT_CRIACAO     = 12/11/2001
 * OBJETIVO       = Compara o valor entre dois campos de data, retornando -1 se Data1 < Data2 ,
 * 0 se Data1 == Data2 e 1 se Data1 > Data2.
 * EXEMPLO DE USO = if(comparaDatas("01/01/2001", "31/12/2001") == -1){
 *                    alert("A primeira data é menor do que a segunda.");
 *                  }
 *
********************************************************************************************************* */
function comparaDatas(Data1, Data2){

  if(Data1 != "" && Data2 != ""){
    var primeiraData = new Date(Data1.substring(6, 10), (Data1.substring(3, 5) -1), Data1.substring(0, 2));
    var segundaData = new Date(Data2.substring(6, 10), (Data2.substring(3, 5) -1), Data2.substring(0, 2));

    var primeiroNumero = primeiraData.getTime();
    var segundoNumero = segundaData.getTime();

    if(primeiroNumero < segundoNumero){ return -1; }
    if(primeiroNumero == segundoNumero){ return 0; }
    if(primeiroNumero > segundoNumero){ return 1; }
  }
}

/* *********************************************************************************************************
 * FUNÇÃO         = void maxLenghtTextArea(Campo, Tam)
 * AUTOR          = rogerm
 * DT_CRIACAO     = 13/11/2001
 * OBJETIVO       = Delimita o maxlenght de textarea
 * EXEMPLO DE USO = <textarea name="textarea" cols="80" rows="5" onBlur="maxLenghtTextArea(this, 100)"></textarea>
********************************************************************************************************* */
function maxLenghtTextArea(Campo, Tam){
  if (Campo.value.length > Tam){
    //alert("Este Campo Ultrapassou o Tamanho Máximo de " + Tam + " Caracteres.");
    Campo.value = Campo.value.substr(0, Tam);
    Campo.focus();
  }
}

/* *********************************************************************************************************
 * FUNÇÃO         = void abrirRelatorio(url, width, height, name)
 * AUTOR          = rogerm
 * DT_CRIACAO     = 16/11/2001
 * OBJETIVO       = Abre uma nova janela apenas com a barra de ferramentas e as barras de rolagem.
 * EXEMPLO DE USO = abrirRelatorio("Endereço da página", "Comprimento", "Largura", "Nome da janela");
 * - O Endereço da página é o unico parametro obrigatório.
********************************************************************************************************* */
function abrirRelatorio(url, width, height, name){
    var horizontal  = window.screen.availWidth;
    var vertical    = window.screen.availHeight;
    var comprimento = 660;
    var altura      = 500;
    var nome	    = "x";

    if(width != null && height != null) {
      comprimento = width;
      altura      = height;
    }

    if(name != null) {
      nome = name;
    }

    var x = window.open(url,nome,"resizable=yes,toolbar=yes,scrollbars=yes,width="+ comprimento + ",height=" + altura);

    horizontal = Math.round((horizontal - comprimento) / 2);
    vertical   = Math.round((vertical   - altura) / 2);

    x.moveTo(horizontal, vertical);
    x.focus();
}

/* *********************************************************************************************************
 * FUNÇÃO         = void abrirNovaJanela(url, width, height)
 * AUTOR          = rogerm
 * DT_CRIACAO     = 19/11/2001
 * OBJETIVO       = Abrir uma nova janela do browser com valores padrões de "altura" e "largura",
 *                  sem barra de menus e ferramentas.
 * EXEMPLO DE USO = abrirRelatorio("Endereço da página", "Comprimento", "Largura");
 * - O Endereço da página é o unico parametro obrigatório.
********************************************************************************************************* */
function abrirNovaJanela(url, width, height) {
    var horizontal  = window.screen.availWidth;
    var vertical    = window.screen.availHeight;
    var comprimento = 690;
    var altura      = 350;

    if(width != null && height != null) {
	    comprimento = width;
	    altura      = height;
    }

    var x = window.open(url,'x',"scrollbars=auto,width="+ comprimento + ",height=" + altura);

    horizontal = Math.round((horizontal - comprimento) / 2);
    vertical   = Math.round((vertical   - altura) / 2);

    x.moveTo(horizontal, vertical);
}

function abrirNovaJanelaComBarraDeRolagem(url, width, height) {
	var horizontal  = window.screen.availWidth;
	var vertical    = window.screen.availHeight;
	if(width = null || height == null) {
		width  = 800;
		height = 600;
	}
	var x = window.open(url,'x','resizable=yes, toolbar=yes, scrollbars=yes, width=' + width + ',height=' + height);

	horizontal = Math.round((horizontal - width) / 2);
	vertical   = Math.round((vertical   - height) / 2);

	x.moveTo(horizontal, vertical);
}

/* *********************************************************************************************************
 * FUNÇÃO         = String retiraTodosEspaco(campo)
 * AUTOR          = leonardod
 * DT_CRIACAO     = 12/03/2002
 * OBJETIVO       = Retira espacos exedentes entre caracteres
 * EXEMPLO DE USO =
 * strVariavel = retiraEspaco(strVariavel);
********************************************************************************************************* */
function retiraTodosEspaco(campo) {
        var campoValidado="";

        for (var i=0; i < campo.value.length; i++) {
            if( (campo.value.charAt(i)!=' ') ) {
              campoValidado = campoValidado + campo.value.charAt(i);
            }
        }
        return campoValidado;
}

function marcarHoraExtra(campo) {
	var valor = campo.checked;
	if (document.forms[0].horaExtra.length) {
		var tam = document.forms[0].horaExtra.length;
		var i = 0;
		for (i = 0; i < tam; i++) {
			document.forms[0].horaExtra[i].checked = valor;
		}
	}
}

function mudarFoco(campoAtual, proximoCampo, tamanho) {
	if (campoAtual.value.length == tamanho) {
		proximoCampo.focus();
	}
}

function validaEmail(mail){
    var er = new RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);
    if(typeof(mail) == "string"){
        if(er.test(mail)){ return true; }
    }else if(typeof(mail) == "object"){
        if(er.test(mail.value)){
          return true;
        }
    }else{
        return false;
    }
}
function habilitaBotao(botao){
		botao.disabled = false;
}

function desabilitaBotao(botao){
		botao.disabled = true;
}

function limpaCombo(combo){
	while(combo.length>0){
		combo.remove(0);
	}
}


function setValorCombo(valor, idCombo){

	var combo = document.getElementById(idCombo);
	for(var i = 0;i<combo.length;i++){
			if(combo[i].value == valor){
				combo[i].selected = true;
			}

	}
}

function mascara_global(mascara, valor){
	if(mascara == '###.###.###-##|##.###.###/####-##'){
		if(valor.length>14){
			return mascara_global('##.###.###/####-##', valor);
		}else{
			return mascara_global('###.###.###-##', valor);
		}
	}

	tvalor = "";
	ret = "";
	caracter = "#";
	separador = "|";
	mascara_utilizar = "";
	valor = removeEspacos(valor);
	if (valor == "")return valor;
	temp = mascara.split(separador);
	dif = 1000;

	valorm = valor;
	//tirando mascara do valor já existente
	for (i=0;i<valor.length;i++){
		if (!isNaN(valor.substr(i,1))){
			tvalor = tvalor + valor.substr(i,1);
		}
	}

	valor = tvalor;

	//formatar mascara dinamica
	for (i = 0; i<temp.length;i++){
		mult = "";
		validar = 0;
		for (j=0;j<temp[i].length;j++){
			if (temp[i].substr(j,1) == "]"){
				temp[i] = temp[i].substr(j+1);
				break;
			}
			if (validar == 1)mult = mult + temp[i].substr(j,1);
			if (temp[i].substr(j,1) == "[")validar = 1;
		}
		for (j=0;j<valor.length;j++){
			temp[i] = mult + temp[i];
		}
	}

	//verificar qual mascara utilizar
	if (temp.length == 1){
		mascara_utilizar = temp[0];
		mascara_limpa = "";
		for (j=0;j<mascara_utilizar.length;j++){
			if (mascara_utilizar.substr(j,1) == caracter){
				mascara_limpa = mascara_limpa + caracter;
			}
		}
		tam = mascara_limpa.length;
	}else{
		//limpar caracteres diferente do caracter da máscara
		for (i=0;i<temp.length;i++){
			mascara_limpa = "";
			for (j=0;j<temp[i].length;j++){
				if (temp[i].substr(j,1) == caracter){
					mascara_limpa = mascara_limpa + caracter;
				}
			}
			if (valor.length > mascara_limpa.length){
				if (dif > (valor.length - mascara_limpa.length)){
					dif = valor.length - mascara_limpa.length;
					mascara_utilizar = temp[i];
					tam = mascara_limpa.length;
				}
			}else if (valor.length < mascara_limpa.length){
				if (dif > (mascara_limpa.length - valor.length)){
					dif = mascara_limpa.length - valor.length;
					mascara_utilizar = temp[i];
					tam = mascara_limpa.length;
				}
			}else{
				mascara_utilizar = temp[i];
				tam = mascara_limpa.length;
				break;
			}
		}
	}

	//validar tamanho da mascara de acordo com o tamanho do valor
	if (valor.length > tam){
		valor = valor.substr(0,tam);
	}else if (valor.length < tam){
		masct = "";
		j = valor.length;
		for (i = mascara_utilizar.length-1;i>=0;i--){
			if (j == 0) break;
			if (mascara_utilizar.substr(i,1) == caracter){
				j--;
			}
			masct = mascara_utilizar.substr(i,1) + masct;
		}
		mascara_utilizar = masct;
	}

	//mascarar
	j = mascara_utilizar.length -1;
	for (i = valor.length - 1;i>=0;i--){
		if (mascara_utilizar.substr(j,1) != caracter){
			ret = mascara_utilizar.substr(j,1) + ret;
			j--;
		}
		ret = valor.substr(i,1) + ret;
		j--;
	}
	return ret;
}

function imprimePercentagem(valor) {
	if (!isNaN(valor)) {
		// transforma em String
		valor = valor + '';

		var inteiro = valor;
		var fracao = '00';
		var indice = valor.indexOf(".");
		if (indice != -1) {
			inteiro = valor.substr(0, indice);
			var diff = 2;
			if (valor.length - indice < 2) {
				diff = valor.length - indice;
			}
			fracao = valor.substr(indice + 1, diff);
		}
		if (fracao.length == 0) {
	        fracao += '00';
	    }
		if (fracao.length == 1) {
	        fracao += '0';
	    }
	    return inteiro + "," + fracao;
	} else {
		return "";
	}
}

function formataValorNumerico(valor) {
	valor = valor + '';
	var end = '';
	for (loopPonto = 0; loopPonto < valor.length; loopPonto++) {
		if (valor.charAt(loopPonto) == ',') {
			end += '.';
		} else if (valor.charAt(loopPonto) != '.') {
			end += valor.charAt(loopPonto);
		}
	}
	var num = parseFloat(end);
	num = num.toPrecision(5);
	return num;
}

function contaRegistros(tbId,idElement){
	var tb = document.getElementById(tbId);
	var retorno = tb.rows.length;
	var elemento = document.getElementById(idElement);

	for(var i=0;i<tb.rows.length;i++){
		if(tb.rows[i].id=='linhaTitulo'){
			retorno--;
		}
	}

	if(retorno==0){
		elemento.innerHTML='0 item';
		return ;
	}

	if(retorno<10){
		if(retorno==1){
			elemento.innerHTML= '01 item';
			return;
		}else{
			elemento.innerHTML= '&nbsp;&nbsp;0'+retorno+' itens';
			return
		}
	}
	elemento.innerHTML= '&nbsp;&nbsp;'+retorno +' itens';

}

function show(flag,idComponent){

	var componente = document.getElementById(idComponent);
	if(componente==null ||componente==undefined){
		alert('Objeto '+idComponent+' não encontrado');
		return false;
	}
	if(flag){
		componente.style.display='block';
	}else{
		componente.style.display='none';
	}
}

function showVisibility(flag,idComponent){

	var componente = document.getElementById(idComponent);
	if(componente==null ||componente==undefined){
		alert('Objeto '+idComponent+' não encontrado');
		return false;
	}
	if(flag){
		componente.style.visibility='visible';
	}else{
		componente.style.visibility='hidden';
	}
}


function zebraTabela(tbId){
	//alert('debug 1 '+tb.rows.length);
	var tb = document.getElementById(tbId);
	for(var i=0;i<tb.rows.length;i++){
		var linha = tb.rows[i];
		//alert('debug 2');
		if(linha.id=='linhaTitulo'){
			//alert('debug 1');
			continue;
			}
		if((i%2)!=0){
			//alert('debug par');
			linha.className='campos_lista';
		}else{
			//alert('debug impar');
			linha.className = 'campos_lista_branco'
		}
	}
	//alert('final');
}

function removeEspacos(valor){
var valorSemEspacos="";

var tamanho = valor.length;
	for (i = 0; i<30;i++){
		if(valor.substr(i,1)==" "){
		}else{
		valorSemEspacos = valorSemEspacos + valor.substr(i,1);
		}
	}
return valorSemEspacos;
}


function voltarPaginaAnterior () {
	var formulario = document.getElementById('formulario');
	if (formulario == null) {
		alert('Para utilização da função genérica voltar é necessário que o form da página tenha o id formulário');
		return;
	}
	var metodo = document.getElementById('method');
	if (metodo == null) {
		alert('Para utilização da função genérica voltar é necessário existir o campo hidden method');
		return;
	}
	metodo.value = 'voltar';
	formulario.submit();
}

function MascaraMoeda(valor, e){
    var sep = 0;
    var key = '';
    var i = j = 0;
    var len = len2 = 0;
    var strCheck = '0123456789';
    var aux = aux2 = '';
    len = valor.length;
    for(i = 0; i < len; i++)
        if ((valor.charAt(i) != '0') && (valor.charAt(i) != ",")) break;
    		aux = '';
    for(; i < len; i++)
        if (strCheck.indexOf(valor.charAt(i))!=-1) aux += valor.charAt(i);
    aux += key;
    len = aux.length;
    if (len == 0) valor = '';
    if (len == 1) valor = '0'+ "," + '0' + aux;
    if (len == 2) valor = '0'+ "," + aux;
    if (len > 2) {
        aux2 = '';
        for (j = 0, i = len - 3; i >= 0; i--) {
            if (j == 3) {
                aux2 += ".";
                j = 0;
            }
            aux2 += aux.charAt(i);
            j++;
        }
        valor = '';
        len2 = aux2.length;
        for (i = len2 - 1; i >= 0; i--)
        valor += aux2.charAt(i);
        valor += "," + aux.substr(len - 2, len);
    }
    return valor;
}


/*
 * Retorna true se a string for vazia.
 */
function isStringVazia (string) {
 	return (string == null || string.toString() == "");
}

 /**
  * Substitui a string localizada caso ela exista.
  *
  * @string String que será alterada.
  * @localizar String que será localizada.
  * @novaString Nova string.
  */
function substituirString(string, localizar, novaString) {
 	if (!isStringVazia(string) && !isStringVazia(localizar)) {
	   string = new String(string);
	   localizar = new RegExp(localizar, "g");
	   string = string.replace(localizar, novaString);
  	}
	return string;
}

function isNumero(string) {
  var res = false;
  if (!this.isStringVazia(string)) {
   var localizar = new RegExp("[^0-9]");
   res = !localizar.test(string);
  }

  return res;
}


function novoInteiro(string) {
  var res = 0;

  if (!this.isStringVazia(string) && this.isNumero(string)) {
   res = parseInt(string);
  }
  return res;
}


/**
  * Substitui a string do índice determinado por uma nova String.
  *
  * @string String que será alterada.
  * @indice Índice da String
  * @novaString  Nova string.
  */
function substituirStringNoIndice(string, indice, novaString) {
	 if (!isStringVazia(string) && !isStringVazia(indice)) {
	  if (isStringVazia(novaString)) {
	   novaString = "";
	  }
	  indice =  novoInteiro(indice);
	  var prefixo = string.substring(0, indice);
	  var sufixo = string.substring(indice+1, string.length);

	  string = prefixo + novaString + sufixo;
	 }

	 return string;
}

function inserirStringNaEsquerda(string, novaString, quantidade, total) {
  if (!this.isStringVazia(novaString)) {
	 if (string == null) {
	  	string = "";
	 }
	 var inicio = string.length;
	 var fim = inicio + this.novoInteiro(quantidade);
	 if (!this.isStringVazia(total)) {
	  fim = this.novoInteiro(total);
	 }

	 for (var tamanho = inicio; tamanho < fim; tamanho = string.length) {
	  string = novaString + string;
	 }
  }

  return string;
}


/**
 * Função para formatar uma string baseada no pattern passado por parâmetro.
 *
 * Exemplo:
 *		formatar("23101978", "##/##/####", null) => 23/10/1978
 *		formatar("15", "##:##", "0") => 15:00
 *
 * @string String que será formatada.
 * @pattern Pattern que será aplicado à string.
 * @completar String que será usada para completar a formatação,
 *		caso a string que será mascarada não possuia quantidade suficiente
 */
function formatar(string, pattern, completar) {
	if (!isStringVazia(string) && !isStringVazia(pattern)) {

		if (string.length > 0) {
			string = inserirStringNaEsquerda(string, "0", null, 3);
		}

		var caracteres = substituirString(pattern, '#', "");
		if (!isStringVazia(caracteres)) {
			caracteres = "["+ caracteres +"]";
			string = substituirString(string, caracteres, "");
		}

		if (!isStringVazia(string)) {
			var resposta = pattern;

			for (var indice = 0; indice < pattern.length; indice++) {
				var caracterDoPattern 	= pattern.charAt(indice);
				var caracter			= string.charAt(0);
				if (caracterDoPattern == '#') {
					if (string.length > 0) {
						string			= string.substring(1);
					} else {
						if (!isStringVazia(completar)) {
							caracter = completar;
						}
					}
					if (!isStringVazia(caracter)) {
						resposta = substituirStringNoIndice(resposta, indice, caracter);
					}
				}

				if (isStringVazia(string)) {
					resposta = resposta.substring(0, indice+1);
					indice = pattern.length;
				}
			}
			string = resposta;
		}
	} else {
		string = "";
	}

	return string;
}

function f_sTiraCaracter(sString,sChar)
{
 var sBusca = new RegExp("["+sChar+"]","g");
 sString = sString.replace(sBusca,"");
 return (sString);
}

// Função.....: f_sColocaCaracter
// Objetivo...: Insere um caracter onde quer que queira.
// Entrada....: sString  <- string com o valor
//    sChar  <- caracter a ser inserido
//    iCasa  <- posição index na string.
// Exemplo....: alert(f_sColocaCaracter("01072003","/",2));
// Autor......: Adriano Pamplona
// Alterado...: Rafael L. Sá / Daniele Dickel
function f_sColocaCaracter(sString,sChar,iCasa)
{
 var sRetorno = "";
 for (var i = 0; i < sString.length; i++)
 {
  if (i == (parseInt(iCasa, 10)))
  {
   sRetorno = sRetorno + sChar ;
  }
  sRetorno = sRetorno + sString.charAt(i);
 }
 return sRetorno;
}


function mascaraReal(sValor)
{
 var sRetorno = "";

 switch (sValor.length){
  case 0:
   sRetorno = "";
   break;
  case 1:
   sRetorno = "0,0" + sValor;
   break;
  case 2:
   sRetorno = "0," + sValor;
   break;
  default:
   sValor = f_sTiraCaracter(sValor, ".");
   sValor = f_sTiraCaracter(sValor, ",");
   sValor = f_sColocaCaracter(sValor, ",", sValor.length-2);
   if (sValor.charAt(0)==0) {
    sValor = sValor.substr(1, sValor.length);
   }
   if (sValor.charAt(0)==",") {
    sValor = sValor.substr(1,sValor.length);
   }
   if (sValor.length==2) {
    sValor = "0,"+sValor;
   }

   if (sValor.length > 6) {
    var bPonto = /\./g;
    var sValorTemp = sValor.substr(0,sValor.indexOf(","))
    var sValorTemp = f_sTiraCaracter(sValorTemp,".");
    var vRet = "";
    cont = 0;
    for (var i = sValorTemp.length; i >= 0; i--) {
     vRet = sValorTemp.charAt(i) + vRet;
     if (cont == 3){
      vRet = "." + vRet;
      cont = 0;
     }
     cont ++;
    }
    while (vRet.charAt(0)=="." || vRet.charAt(0)=="0") {
     vRet = vRet.substr(1,vRet.length);
    }
    sValor = vRet + sValor.substr(sValor.indexOf(","),sValor.length);
   }
   sRetorno = sValor;
 }
 	return sRetorno;

}

/*
 * Itera sobre todos os indices do radioButton e retorna o índice que estiver checado.
 *
 * Parametro:
 * ----------
 * radio: Um objeto do tipo radioButton.
 *
 * Retorno:
 * --------
 * O objeto do índice do array do radioButton que estiver marcado.
 *
 */
function recuperarRadioChecado(radio){
	result = null;

	//Itera sobre todas as opções do radiobutton.
	for(var i = 0 ; i < radio.length ; i++){
		if(radio[i].checked){
			result = radio[i];
			break;
		}
	}

	return result;
}

function isVazio(sString) {
	var regEspaco = /\s/g;
	sString = sString.replace(regEspaco, "");
	return (sString == "");
}

function limitarTamanho(tamanho,valor){
	if(valor.length > tamanho){
		valor = valor.substr(0,tamanho);
	}
	return valor;
}

function limitarTextarea(tamanho, campo){
	valor = campo.value;
	if(valor.length > tamanho){
		campo.value = valor.substr(0,tamanho);
	}
}
/*
 * Funcao global para mascaras com expressao regular
 * Exemplos:
 * Normal
 * - onkeypress="mascaraPrincipal(this, mascaraNumero);"
 * JQuery (Adicione a Class campoNumerico ao campo e pronto.
 * $(".campoNumerico").keypress(function(){mascaraPrincipal(this, validaEntradaSomenteNumero);});
 */
function mascaraPrincipal(o, f){
    v_obj=o;
    v_fun=f;
    setTimeout("execmascara()",1);
}

function execmascara(){
    v_obj.value=v_fun(v_obj.value);
}

/*Função que Mascara NIS*/
function nis(v){
	 v=v.replace(/\D/g,"");
     v=v.replace(/^(\d{3})(\d)/,"$1.$2");
     v=v.replace(/\.(\d{5})(\d)/,".$1.$2");
     v=v.replace(/^(\d{3})\.(\d{5})(\d)/,"$1.$2.$3");
     v=v.replace(/^(\d{3})\.(\d{5}).(\d{2})(\d)/,"$1.$2.$3-$4");
    return v;
}

/*Função que Mascara NIS*/
function monetaria(v){
	 v=v.replace(/\D/g,"");
	 return mascaraReal(v);
}

function mascaraNumero(v) {
	var v = v;
	return v.replace(/\D/g,"");
}

function mascaraLetras(v) {
	var v = v;
	return v.replace(/[^A-Za-z]/,"");
}

function mascaraData(v){
    v=v.replace(/\D/g,"");                 //Remove tudo o que não é dígito
    v=v.replace(/(\d{2})(\d)/,"$1/$2");    //Coloca uma barra entre o segundo e terceiro dígitos
    v=v.replace(/(\d{2})(\d)/,"$1/$2");    //Coloca uma barra entre o quarto e o quinto dígitos
    return v;
}

function mascaraHora(v){
    v=v.replace(/\D/g,"");                 //Remove tudo o que não é dígito
    v=v.replace(/(\d{2})(\d)/,"$1:$2");    //Coloca : entre o primeiro e segundo dígitos
    return v;
}


/**
 * Aplica maiuscula
 */
function apenasMaiusculas(field) {
	event.keyCode = 0;
	field.value = field.value.toUpperCase();
}
/*Função que padroniza CPF*/
function cpf(v){
    v=v.replace(/\D/g,"");
    v=v.replace(/(\d{3})(\d)/,"$1.$2");
    v=v.replace(/(\d{3})(\d)/,"$1.$2");

    v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2") ;
    return v;
}

/*Função que padroniza CEP*/
function cep(v){
    v=v.replace(/\D/g,"");
    v=v.replace(/^(\d{2})(\d)/,"$1.$2");
   v=v.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2-$3");
    return v;
}

/*Função que padroniza CNPJ*/
function cnpj(v){
    v=v.replace(/\D/g,"");
    v=v.replace(/^(\d{2})(\d)/,"$1.$2");
    v=v.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3");
    v=v.replace(/\.(\d{3})(\d)/,".$1/$2");
    v=v.replace(/(\d{4})(\d)/,"$1-$2");
    return v;
}

var XMLUtil = {
	convertString2XML : function (string) {
		var doc = null;
		if (window.ActiveXObject) {
			doc = new ActiveXObject('Microsoft.XMLDOM');
			doc.async = 'false';
			doc.loadXML(string);
		} else {
			var parser = new DOMParser();
			doc = parser.parseFromString(string, 'text/xml');
		}
		return doc;
	}
}

