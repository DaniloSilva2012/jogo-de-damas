tabela = {};

tabela.contador = function(){
  var black = document.querySelectorAll('circle[data-color="b"]');
  var white = document.querySelectorAll('circle[data-color="w"]');
  var countPretas = document.getElementById('pecasPreta');
  var countBrancas = document.getElementById('pecasBranca');
  var countVitoriasBranca = document.getElementById('vitoriasBranca');
  var countVitoriasPreta = document.getElementById('vitoriasPreta');
  var vitoriasBranca = parseInt(countVitoriasBranca.textContent);
  var vitoriasPreta = parseInt(countVitoriasPreta.textContent);

  countPretas.textContent = black.length;
  countBrancas.textContent = white.length;

  if(countPretas.textContent == '0'){
    alert('As brancas ganharam');
    vitoriasBranca += 1;
    countVitoriasBranca.textContent = vitoriasBranca;
    tabuleiro.init(initPecas, initCasas);
  }
  if(countBrancas.textContent == '0'){
    alert('As pretas ganharam');
    vitoriasPreta += 1;
    countVitoriasPreta.textContent = vitoriasPreta;
    tabuleiro.init(initPecas, initCasas);
  }
};

var tabuleiro = {},
    selectedItem = '',
    position = '',
    line = '',
    direita = '',
    esquerda = '',
    captured = [0,0,0,0,0];

tabuleiro.casas = document.getElementsByTagName('rect');
tabuleiro.pecas = document.getElementsByTagName('circle');


lookupTableX = [75,175,275,375,25,125,225,325,75,175,275,375,25,125,225,325,75,175,275,375,25,125,225,325];
lookupTableY = [25,25,25,25,75,75,75,75,125,125,125,125,275,275,275,275,325,325,325,325,375,375,375,375];

tabuleiro.helperPosition = function(line){
  if(line == 'a' || line == 1) return [1,'a',[1,2,3,4]];
  if(line == 'b' || line == 2) return [2,'b',[5,6,7,8]];
  if(line == 'c' || line == 3) return [3,'c',[9,10,11,12]];
  if(line == 'd' || line == 4) return [4,'d',[13,14,15,16]];
  if(line == 'e' || line == 5) return [5,'e',[17,18,19,20]];
  if(line == 'f' || line == 6) return [6,'f',[21,22,23,24]];
  if(line == 'g' || line == 7) return [7,'g',[25,26,27,28]];
  if(line == 'h' || line == 8) return [8,'h',[29,30,31,32]];  
};

tabuleiro.helperSelectedCaptor = function(on, positionP){
  var on = on;
  var positionP = positionP || 0;
  var pecas = tabuleiro.pecas;

  if(on != false){  
    var piece = document.querySelectorAll('circle[data-position="'+positionP+'"]')[0];
    if(piece == undefined){
      return false;
    }
    var idItem = piece.getAttribute('id');
    idItem = idItem.substr(1, idItem.length);
  } else {
    for (var i = pecas.length - 1; i >= 0; i--) {
      pecas[i].setAttribute('stroke', 'gray');
    };
    return false;
  }

  var jogador = document.getElementById('jogador');
   
  if(idItem > 12){
    if(on == true){
      piece.setAttribute('stroke','black');
      jogador.textContent = 'captura obrigatória';
    } else {
      piece.setAttribute('stroke','gray');
    }    
  } else if(idItem <= 12 && idItem != 0){
    if(on == true){
      piece.setAttribute('stroke','white');
      jogador.textContent = 'captura obrigatória';
    } else {
      piece.setAttribute('stroke','gray');
    }     
  }
};

tabuleiro.helperSelected = function(value, positionP, prop, idItem, captura, direction, type){
  var casas = tabuleiro.casas;
  var positionImpar = [5,13,21,29];
  var positionPar = [4,12,20,28];
  var protectPiece;
  var piece = document.querySelectorAll('circle[data-position="'+ positionP +'"]')[0];
  var type = type || 'normal';
  var jogador = document.getElementById('jogador');
  var prop = prop;

  if(value > 32 || value < 1){
    return false;
  }

  protectPiece = document.querySelectorAll('circle[data-position="'+(value + 1)+'"]');
  
  if(protectPiece[0] == undefined){
    console.log(protectPiece[0], prop);
    if(prop == 'impar'){ 
        console.log('impar');   
        for (var i = positionPar.length - 1; i >= 0; i--) {
          if(positionPar[i] == positionP && direction == 'direita'){
            console.lof('impar direita nula');
            return false;
          } else if((positionPar[i] - 3) == positionP && direction == 'esquerda'){
            console.lof('impar esquerda nula');
            return false;
          }
        }

        tabuleiro.helperSelectedCaptor(true,positionP);
        
        if(direction == 'direita'){
          captured[0] = captura; 
          captured[2] = casas[value].id;                      
        } else {
          captured[1] = captura; 
          captured[3] = casas[value].id; 
        }          
      }

      if(prop == 'par'){ 
        console.log('par');
        for (var i = positionImpar.length - 1; i >= 0; i--) {
          if(positionImpar[i] == positionP && direction == 'esquerda'){
            console.lof('par esquerda nula');
            return false;
          } else if((positionImpar[i] + 3) == positionP && direction == 'direita'){
            console.lof('par direita nula');
            return false;
          } 
        }

        tabuleiro.helperSelectedCaptor(true, positionP);

        if(direction == 'direita'){
          captured[0] = captura; 
          captured[2] = casas[value].id;                       
        } else {
          captured[1] = captura; 
          captured[3] = casas[value].id; 
        }  
      } 

    casas[value].setAttribute("fill","blue");
    casas[value].setAttribute("selected","true");      
  }   
};

tabuleiro.tryPosition = function(position){
  var casas = tabuleiro.casas;
  var pecas = tabuleiro.pecas;

  if(position < 1 || position > 32){
    return 0;
  } else {
    var id = casas[position].getAttribute('id');

    return [id, document.querySelectorAll('circle[data-position="'+position+'"]')[0]];
  }
};

tabuleiro.helperOrientation = function(positionP, idItem){
  var cantoPar = [4,12,20,28];
  var cantoImpar = [5,13,21,29];
  var positionCanto = 0;

  if(positionP > 32 || positionP < 1){
    return 0;
  }

  for (var i = cantoImpar.length - 1; i >= 0; i--) {
    if(cantoImpar[i] == positionP){
      positionCanto = cantoImpar[i];
    }
  };

  for (var i = cantoPar.length - 1; i >= 0; i--) {
    if(cantoPar[i] == positionP){
      positionCanto = cantoImpar[i];
    }
  };

  return positionCanto;

};

tabuleiro.capture = function(positionP, numberLine, idItem, direita, esquerda, casas, type, directionType){
  var pecas = tabuleiro.pecas;
  var casas = casas;
  var attrPosition = '';
  var prop = '';
  var lineFront = tabuleiro.helperPosition(numberLine - 1);
  var lineBack = tabuleiro.helperPosition(numberLine + 1);
  var piece = document.getElementById('p' + idItem).getAttribute('data-color');
  var occuped = document.querySelectorAll('rect[ocupped]');
  var type = type || 'normal';

  var direita = parseInt(direita.substr(1,direita.length)) - 1;
  var esquerda = parseInt(esquerda.substr(1,esquerda.length)) - 1; 
  var idItem = idItem;

  if(numberLine%2==0){
    prop = 'par';
  } else {
    prop = 'impar';
  }
  
  console.log('captured', prop);

  if(idItem <= 12 && type != 'dama'){
    if(occuped[direita] != undefined && occuped[direita].getAttribute('ocupped') == 'w'){
      if(prop == 'impar' && (positionP + 8) <= 32){
          tabuleiro.helperSelected(positionP + 8, positionP, prop, idItem, positionP + 5, 'direita');  
      } else if(prop == 'par' && (positionP + 8) <= 32){
          tabuleiro.helperSelected(positionP + 8, positionP, prop, idItem, positionP + 4, 'direita');  
      }
    }
    if(occuped[esquerda] != undefined && occuped[esquerda].getAttribute('ocupped') == 'w'){
      if(prop == 'impar' && (positionP + 6) <= 32){
        tabuleiro.helperSelected(positionP + 6, positionP, prop, idItem, positionP + 4, 'esquerda');  
      } else if(prop == 'par' && (positionP + 6) <= 32){
        tabuleiro.helperSelected(positionP + 6, positionP, prop, idItem, positionP + 3, 'esquerda');  
      }
    }
  } else if(idItem > 12 && type != 'dama'){
    if(occuped[direita].getAttribute('ocupped') == 'b'){
      if(prop == 'impar' && (positionP - 8) >= 1){
        tabuleiro.helperSelected(positionP - 8, positionP, prop, idItem, positionP - 3, 'direita');   
      } else if(prop == 'par' && (positionP - 8) >= 1){
        tabuleiro.helperSelected(positionP - 8, positionP, prop, idItem, positionP - 4, 'direita');               
      }
    }

    if(occuped[esquerda].getAttribute('ocupped') == 'b'){
      if(prop == 'impar' && (positionP - 10) >= 1){
        tabuleiro.helperSelected(positionP - 10, positionP, prop, idItem, positionP - 4, 'esquerda');                 
      } else if(prop == 'par' && (positionP - 10) >= 1){
        tabuleiro.helperSelected(positionP - 10, positionP, prop, idItem, positionP - 5, 'esquerda');                 
      }
    }
  } else {

    if(occuped[direita].getAttribute('ocupped') != piece){
      if(prop == 'impar'){
        if(directionType == 'top'){
          tabuleiro.helperSelected(positionP - 8, positionP, prop, idItem, positionP - 3, 'direita');             
        } else {
          tabuleiro.helperSelected(positionP + 8, positionP, prop, idItem, positionP + 5, 'direita');          
        }
      }

      if(prop == 'par'){
        if(directionType == 'top'){
          tabuleiro.helperSelected(positionP - 8, positionP, prop, idItem, positionP - 4, 'direita');             
        } else {
          tabuleiro.helperSelected(positionP + 8, positionP, prop, idItem, positionP + 4, 'direita');          
        }             
      }
    }

    if(occuped[esquerda].getAttribute('ocupped') != piece){
     if(prop == 'impar'){
        if(directionType == 'top'){
          tabuleiro.helperSelected(positionP - 10, positionP, prop, idItem, positionP - 4, 'esquerda');             
        } 
        if(directionType == 'bottom'){
          tabuleiro.helperSelected(positionP + 8, positionP, prop, idItem, positionP + 5, 'esquerda');          
        }
      }

      if(prop == 'par'){
        if(directionType == 'top'){
          tabuleiro.helperSelected(positionP - 10, positionP, prop, idItem, positionP - 5, 'esquerda');             
        }
        if(directionType == 'bottom'){
          tabuleiro.helperSelected(positionP + 6, positionP, prop, idItem, positionP + 3, 'esquerda');          
        }             
      }
    }
  }

  if(captured[2] != 0){
    if(captured[3] == 0){
      var obj= document.querySelectorAll('rect[data-position="'+(captured[0] - 1)+'"]')[0];
      obj.removeAttribute('selected');
      obj.setAttribute('fill','black');
    }
  }
  if(captured[3] != 0){
    if(captured[2] == 0){
      var obj= document.querySelectorAll('rect[data-position="'+(captured[1] + 1)+'"]')[0];
      obj.removeAttribute('selected');
      obj.setAttribute('fill','black');
    }
  }
};

tabuleiro.removePeca = function(captured, idItem, color){
  var casas = tabuleiro.casas;
  var item;
  
  if(captured[0] == 0 && captured[1] == 0) {
    return false;
  }
  
  if(captured[2] == captured[4]){
    item = captured[0]; 
  } else if(captured[3] == captured[4]){
    item = captured[1]; 
  }

  var elem = document.querySelectorAll('circle[data-position="'+item+'"]');

  if(elem[0] == undefined){
    return false;
  }

  elem = document.getElementById(elem[0].id);

  if(elem.getAttribute('data-color') != color){
    elem.parentNode.removeChild(elem);  
  }
  tabuleiro.helperSelectedCaptor(false);  
  tabuleiro.clear(casas);
};

tabuleiro.verify = function(idItem, casas, line, positionP, itemOrientation){
  var idItem = parseInt(idItem.replace('p',''));
  var numberLine = tabuleiro.helperPosition(line);
  var positionP = parseInt(positionP);
  var piece = document.querySelectorAll('circle[data-position="'+positionP+'"]')[0];
  
  if(piece.getAttribute('data-type') != 'dama'){

    if(idItem <= 12 && (numberLine[0]%2==0) && itemOrientation == 0){
      tabuleiro.helperSelected(positionP + 3);  
      tabuleiro.helperSelected(positionP + 2);
      direita = tabuleiro.tryPosition(positionP + 3);
      esquerda = tabuleiro.tryPosition(positionP + 2);  
      tabuleiro.capture(positionP, numberLine[0], idItem, direita[0], esquerda[0], casas);        
    } else if(idItem <= 12 && (numberLine[0]%2!=0) && itemOrientation == 0){
      tabuleiro.helperSelected(positionP + 4);  
      tabuleiro.helperSelected(positionP + 3);
      direita = tabuleiro.tryPosition(positionP + 4);
      esquerda = tabuleiro.tryPosition(positionP + 3);  
      tabuleiro.capture(positionP, numberLine[0], idItem, direita[0], esquerda[0], casas);
    } else if(idItem > 12 && (numberLine[0]%2!=0) && itemOrientation == 0){
      tabuleiro.helperSelected(positionP - 5);  
      tabuleiro.helperSelected(positionP - 4);
      direita = tabuleiro.tryPosition(positionP - 4);
      esquerda = tabuleiro.tryPosition(positionP - 5); 
      tabuleiro.capture(positionP, numberLine[0], idItem, direita[0], esquerda[0], casas);  
    } else if(idItem > 12 && (numberLine[0]%2==0) && itemOrientation == 0){
      tabuleiro.helperSelected(positionP - 5);  
      tabuleiro.helperSelected(positionP - 6);
      direita = tabuleiro.tryPosition(positionP - 5);
      esquerda = tabuleiro.tryPosition(positionP - 6);  
      tabuleiro.capture(positionP, numberLine[0], idItem, direita[0], esquerda[0], casas);  
    } else if(idItem > 12 && (numberLine[0]%2==0) && itemOrientation != 0){  
      tabuleiro.helperSelected(positionP - 5);  
      direita = tabuleiro.tryPosition(positionP - 5);
      tabuleiro.capture(positionP, numberLine[0], idItem, direita[0], esquerda[0], casas);
    } else if(idItem > 12 && (numberLine[0]%2!=0) && itemOrientation != 0){ 
      tabuleiro.helperSelected(positionP - 5);  
      esquerda = tabuleiro.tryPosition(positionP -5);
      tabuleiro.capture(positionP, numberLine[0], idItem, direita[0], esquerda[0], casas);
    } else if(idItem <= 12 && (numberLine[0]%2==0) && itemOrientation != 0){  
      tabuleiro.helperSelected(positionP + 3);  
      direita = tabuleiro.tryPosition(positionP + 3);
      tabuleiro.capture(positionP, numberLine[0], idItem, direita[0], esquerda[0], casas);
    } else if(idItem <= 12 && (numberLine[0]%2!=0) && itemOrientation != 0){  
      tabuleiro.helperSelected(positionP + 3);  
      esquerda = tabuleiro.tryPosition(positionP + 3);
      tabuleiro.capture(positionP, numberLine[0], idItem, direita[0], esquerda[0], casas);
    } 
    
  } else {
    if(numberLine[0]%2==0){
      tabuleiro.helperSelected(positionP + 2);  
      tabuleiro.helperSelected(positionP + 3);
      tabuleiro.helperSelected(positionP - 5);
      tabuleiro.helperSelected(positionP - 6);

      pbottom = [tabuleiro.tryPosition(positionP + 2), tabuleiro.tryPosition(positionP + 3)];
      ptop = [tabuleiro.tryPosition(positionP - 6), tabuleiro.tryPosition(positionP - 5)];

      tabuleiro.capture(positionP, numberLine[0], idItem, pbottom[0][0], pbottom[1][0], casas, 'dama', 'bottom');           
      tabuleiro.capture(positionP, numberLine[0], idItem, ptop[0][0], ptop[1][0], casas, 'dama', 'top');                  

    } else {
      
      tabuleiro.helperSelected(positionP + 3);  
      tabuleiro.helperSelected(positionP + 4);
      tabuleiro.helperSelected(positionP - 4);
      tabuleiro.helperSelected(positionP - 5);

      pbottom = [tabuleiro.tryPosition(positionP + 3), tabuleiro.tryPosition(positionP + 4)];
      ptop = [tabuleiro.tryPosition(positionP - 5), tabuleiro.tryPosition(positionP - 4)];

      tabuleiro.capture(positionP, numberLine[0], idItem, ptop[0][0], ptop[1][0], casas, 'dama', 'top');  
      tabuleiro.capture(positionP, numberLine[0], idItem, pbottom[0][0], pbottom[1][0], casas, 'dama', 'bottom');  
    }
  }
};

tabuleiro.clear = function(casas, line){
  var pecas = tabuleiro.pecas;
  var line = line || '';
  var casas = tabuleiro.casas;
  if(line != ''){
    for (var i = line.length - 1; i >= 0; i--) {
      casas[line[i]].setAttribute("fill","black");
      casas[line[i]].removeAttribute("selected");
    };      
  } else {
    for (var i = casas.length - 1; i >= 0; i--) {
      casas[i].setAttribute("fill","black");
      casas[i].removeAttribute("selected");
    };      
  }

  captured = [0,0,0,0,0];

};

tabuleiro.round = function(){
  var jogadasTotal = document.getElementById('jogadasTotal');
  var jogada = parseInt(jogadasTotal.textContent) + 1;

  if(jogada <= 1 || jogada % 2 != 0){
    return 'branca';    
  } else {
    return 'preta';
  }
};

tabuleiro.selecionarPeca = function(casas, event, id){
  if(event == 0){
    var idItem = id;
  } else {
    var idItem = event.toElement.id;    
  }

  selectedItem = idItem;
  item = idItem.substr(1,idItem.length);
  var positionP = document.getElementById(idItem).getAttribute('data-position');  

  var jogador = tabuleiro.round();
 
  if(jogador == 'branca' && item <= 12){
    document.getElementById('jogador').textContent = 'É a vez das Brancas';
    return false;
  }

  if(jogador == 'preta' && item > 12){
    document.getElementById('jogador').textContent = 'É a vez das Pretas';
    return false;
  }

  if(positionP <= 4 ){
    line = 'a';
  } else if(positionP <= 8 ){
    line = 'b';
  } else if(positionP <= 12 ){
    line = 'c';
  } else if(positionP <= 16 ){
    line = 'd';
  } else if(positionP <= 20 ){
    line = 'e';
  } else if(positionP <= 24 ){
    line = 'f';
  } else if(positionP <= 28 ){
    line = 'g';
  } else if(positionP <= 32 ){
    line = 'h';
  }

  var itemOrientation = tabuleiro.helperOrientation(positionP, idItem);
  document.getElementById(line + '' + positionP).setAttribute("fill","red");  
  tabuleiro.verify(idItem, casas, line, positionP, itemOrientation);
};

tabuleiro.pieceType = function(idItem){
  var id = idItem.substr(1,idItem.length);

  if(document.querySelectorAll('circle[data-position="'+id+'"]')[0] == undefined){
    return false;
  }

  var type = document.getElementById(idItem).getAttribute('data-type');
  var color = document.getElementById(idItem).getAttribute('data-color');
  var position = document.getElementById(idItem).getAttribute('data-position');
  var strRect = document.querySelectorAll('rect[data-position="'+position+'"]')[0].id;
  strRect = strRect.substr(0,1);

  var line = tabuleiro.helperPosition(strRect);
  
  if(type == 'normal' && color == 'w' && line[1]=='a'){
    document.getElementById(selectedItem).setAttribute('data-type','dama');
    document.getElementById(selectedItem).setAttribute('fill','green');
  } else if (type == 'normal' && color == 'b' && line[1]=='h'){
    document.getElementById(selectedItem).setAttribute('data-type','dama');
    document.getElementById(selectedItem).setAttribute('fill','yellow');
  }
};

tabuleiro.move = function(idItem){

  var sel = document.getElementById(idItem).getAttribute('selected');
  var cx = document.getElementById(idItem).getAttribute('x');
  var cy = document.getElementById(idItem).getAttribute('y');
  var countStr = idItem.length;
  var color = document.getElementById(selectedItem).getAttribute('data-color');
  var positionAnt = document.getElementById(selectedItem).getAttribute('data-position');
  var type = document.getElementById(selectedItem).getAttribute('data-type');
  var jogadasBranca = document.getElementById('jogadasBranca');
  var jogadasPreta = document.getElementById('jogadasPreta');  
  var jogadasTotal = document.getElementById('jogadasTotal');  

  if(document.getElementById(line + '' + positionAnt) == null){
    return false;
  }

  document.getElementById(line + '' + positionAnt).setAttribute('ocupped','');

  if(typeof (selectedItem) != 'undefined' && sel === 'true'){
    document.getElementById(selectedItem).setAttribute('cx', parseInt(cx) + 25);
    document.getElementById(selectedItem).setAttribute('cy', parseInt(cy) + 25);
    document.getElementById(selectedItem).setAttribute('data-position', idItem.substr(1, countStr));
    document.getElementById(idItem).setAttribute('ocupped', color);
    captured[4] = idItem;
    tabuleiro.removePeca(captured, captured[4], color);
    if (color == 'w') {
      var num = parseInt(jogadasBranca.textContent); 
      jogadasBranca.textContent = num + 1;
    } else {
      var num = parseInt(jogadasPreta.textContent); 
      jogadasPreta.textContent = num + 1;
    }    
  
    var total = parseInt(jogadasPreta.textContent) + parseInt(jogadasBranca.textContent);
    jogadasTotal.textContent = total;

    document.getElementById('jogador').textContent = '';
  }
  tabela.contador();
};

tabuleiro.init = function (pecas, casas) {
  for (var i = pecas.length - 1; i >= 0; i--) {
    pecas[i].setAttribute('cx',lookupTableX[i]);
    pecas[i].setAttribute('cy',lookupTableY[i]);
    var cx = pecas[i].getAttribute('cx');
    var cy = pecas[i].getAttribute('cy');
  
    pecas[i].onclick = function(event){
      tabuleiro.clear(casas);
      tabuleiro.selecionarPeca(casas, event);
    }
  }; 

  for (var i = casas.length - 1; i >= 0; i--) {
    var casaId = casas[i].id;
    casaId = parseInt(casaId.substr(1, casaId.length));
    
    if(casaId <= 12){
      casas[i].setAttribute('ocupped','b');
    } else if(casaId > 20){
      casas[i].setAttribute('ocupped','w');
    } else {    
      casas[i].setAttribute('ocupped','');
    }

    casas[i].onclick = function(event){
      var idItem = event.toElement.id;
      tabuleiro.move(idItem);
      tabuleiro.clear(casas);  
    } 
  }
};

window.onclick=function(event){
  var test = event.srcElement.id; 
  var pecas = tabuleiro.pecas;
  var jogador = document.getElementById('jogador');
  var jogada = tabuleiro.round();

  if(jogada == 'branca'){
    for (var i = pecas.length - 1; i >= 0; i--) {
      if(pecas[i].getAttribute('stroke') == 'black'){
        jogador.textContent = 'captura obrigatória';     
        test = pecas[i].id;
      }
    };    
  } else if(jogada == 'preta'){
    for (var i = pecas.length - 1; i >= 0; i--) {
      if(pecas[i].getAttribute('stroke') == 'white'){
        jogador.textContent = 'captura obrigatória';     
        test = pecas[i].id;
      }
    };     
  }
  if(test.substr(0,1)=='p'){
    tabuleiro.pieceType(test);    
  }
  selectedItem = test;
};

tabuleiro.init(tabuleiro.pecas, tabuleiro.casas);