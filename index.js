// forked from gagaga's "forked: Node Garden with Gravity" http://jsdo.it/gagaga/1nej
// forked from eller86's "forked: Node Garden with Gravity" http://jsdo.it/eller86/hcZO
// forked from eller86's "Node Garden with Gravity" http://jsdo.it/eller86/bUZS
// forked from Evan's "Node Garden" http://jsdo.it/Evan/apyQ
// Adapted from Kieth Peters' AS3 code

var img1 = 'image/Snoopy_and_Woodstock.png';
var img2 = 'image/snoopy.png';
var img3 = 'image/woodstock.gif';
var img4 = 'image/pctnpct_logo.png';


var things = [img1, img2, img3];
var things = [img4];
var addedThings = [];
/*
for (var i = 0; i < things.length; i++) {
  things[i]
}
*/

var looper;
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
// 重力の重さ　default:4000
var GRAVITY = 4000;
var GRAVITY_X = SCREEN_WIDTH / 2;
var GRAVITY_Y = SCREEN_HEIGHT / 2;
var canvas = document.getElementById('c');
var context;

var title_left = 0;
var title_right = 0;
var title_top = 0;
var title_bottom = 0;

var tempCol = "";

var init_num=1;
var star_num=0;
var def_num=0;
var minDist = 300;
var springAmount = 0.0001;

var mouseX = SCREEN_WIDTH * 0.5;
var mouseY = SCREEN_HEIGHT * 0.5;
var mouseIsDown = false;

var nodes=[];
var nodes_2 = [];

/**  ファイルアップローダー  **/
var URL_BLANK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
var elDrop = document.getElementById('dropzone');
var elFiles = document.getElementById('files');


var star={radius:6,x:SCREEN_WIDTH / 2,y:SCREEN_HEIGHT / 2,vx:Math.random()*0.2,vy:Math.random()*0.2,g:0.0015,mass:10,
      // x,y座標の設定
      update: function() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x > SCREEN_WIDTH) {
          this.x = 0;
        } else if (this.x < 0) {
          this.x = SCREEN_WIDTH;
        }
        if (this.y > SCREEN_HEIGHT) {
          this.y = 0;
        } else if (this.y < 0) {
          this.y = SCREEN_HEIGHT;
        }
      },
      // 描画       
      draw: function() {
        // 内郭の円を描画
        context.fillStyle = "rgba(250,200,50,0.0001)";
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
        context.closePath();
        context.fill();
      }
};




function documentMouseMoveHandler(event) {
  // clientX(Y)：event の起きた点の、クライアント内での X(Y) 座標を参照できる読み取り専用の属性
  mouseX = event.clientX;
  mouseY = event.clientY;
}
// mouseDown：マウスのボタンを押した
function documentMouseDownHandler(event) {
  mouseIsDown = true;
}
// mouseUp：マウスのボタンを離した
function documentMouseUpHandler(event) {
  mouseIsDown = false;
}
// startにタッチした時の動作
function documentTouchStartHandler(event) {
  if(event.touches.length == 1) {
    event.preventDefault();
    // pageX：イベントが発生したページ上のX座標を示します。この座標値はブラウザウィンドウ上でのX座標値になります。ページ全体でのX座標値を示すわけではないので注意が必要です。
    mouseX = event.touches[0].pageX - (window.innerWidth - SCREEN_WIDTH) * 0.5;
    mouseY = event.touches[0].pageY - (window.innerHeight - SCREEN_HEIGHT) * 0.5;
  }
}

function documentTouchMoveHandler(event) {
  if(event.touches.length == 1) {
    event.preventDefault();

    // *100すると◯が星に集まる。
    mouseX = event.touches[0].pageX *1 ;
    mouseY = event.touches[0].pageY ;
  }
}

// canvasの大きさを設定。カウント用の下に50pxの枠を残している。
function windowResizeHandler(){
  SCREEN_WIDTH = window.innerWidth;
  // スクリーン下部に◯pxの余白を置くか。クリック回数やアップロードデータが表示される。
  SCREEN_HEIGHT = window.innerHeight-200+200;
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
}


/*   アプリケーションの初期化のfunctionの呼び出し   */
init();

//初期化
function init(){
  // canvasの設定。getContextで対象を呼び出し。canvasの場合、常に"2d"。
  if (canvas && canvas.getContext){
    context = canvas.getContext('2d');
  }

  // Register event listeners. 動作ごとに関数の呼び出しを行うよう設定。
  document.addEventListener('mousemove', documentMouseMoveHandler, false);
  document.addEventListener('mousedown', documentMouseDownHandler, false);
  document.addEventListener('mouseup', documentMouseUpHandler, false);
  document.addEventListener('touchstart', documentTouchStartHandler, false);
  document.addEventListener('touchmove', documentTouchMoveHandler, false);
  window.addEventListener('resize', windowResizeHandler, false);

  // windowの/canvasの大きさを設定する関数を呼び出し。
  windowResizeHandler();

  for (var i=0; i<init_num; i++) {
    // リロード時にcreateNodesされた数だけ◯が生成されている。
    createNodes();
  }
  // lineWidth 属性は、座標系の単位で、線の幅を与えます。
  context.lineWidth = 1.5;
  // loop(◯の円周運動を1000/31秒毎に設定。)
  looper = setInterval(loop, 1000/31);
}



// クリックされた時に生成する◯
function createStars() {
   var node = {
      radius: 1+Math.random()*30|0,
      x: mouseX,
      y: mouseY,
      vx: Math.random()*5-3,
      vy: Math.random()*5-3,
      mass: 1,
      num:star_num,
      g:Math.random(),
      rgb1:Math.random()*255|0,
      rgb2:Math.random()*255|0,
      rgb3:Math.random()*255|0,
      update: function() {
        this.x += this.vx;
        this.y += this.vy;
      },
      // 描画
      draw: function() {
        //starを描画。"+"は数字型を明示している。
        context.fillStyle = "rgba("+this.rgb1+","+this.rgb2+","+this.rgb3+",0.8)";
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
        context.closePath();
        context.fill();

        // node番号(star_num)を表示。
        // context.fillStyle = "white";
        // context.fillText(this.num,this.x,this.y);
      }
    };
    // 配列nodesに生成したnodeをpush
    nodes.push(node);
    // node番号(star_num)を+1する。
    star_num++;
}

// クリックされた時に生成するsnoopy
function createSnoopy() {
   var node = {
      x: mouseX,
      y: mouseY,
      vx: Math.random()*5-3,
      vy: Math.random()*5-3,
      mass: 1,
      num:star_num,
      g:Math.random(),
      sizes:Math.random()*50+50|0,
      update: function() {
        this.x += this.vx;
        this.y += this.vy;
      },
      // 描画
      draw: function() {
        //starを描画。"+"は数字型を明示している。
        var img = new Image();
        img.onload = function(){
          context.drawImage(img, node.x, node.y, node.sizes, node.sizes * img.height / img.width);
//          context.drawImage(img, this.x, this.y, 100, 100);
        }
        var arrayNum; // = this.num % things.length;
        //img.src = things[arrayNum];

        if (this.num <= star_num - def_num -1) {
            arrayNum = this.num % things.length;
            img.src = things[arrayNum];
        }else if(addedThings.length == 0) {
            arrayNum = this.num % things.length;
            img.src = things[arrayNum];
        }else{
            arrayNum = this.num % addedThings.length;
            img.src = addedThings[arrayNum];
            console.log("img.width:" + img.width + "  img.height:" + img.height);
        }

      }
    };
    // 配列nodesに生成したnodeをpush
    nodes.push(node);
    // node番号(star_num)を+1する。
    star_num++;
}

var dropHere = document.getElementById('dropHere');

function createTitle(){
  title_left = SCREEN_WIDTH/2 - SCREEN_WIDTH/4;
  title_right = SCREEN_WIDTH/2 + SCREEN_WIDTH/4;
  title_top = SCREEN_HEIGHT/8 - SCREEN_HEIGHT/12 + 20 + 150;
  title_bottom = SCREEN_HEIGHT/8 + SCREEN_HEIGHT/12 + 150;

  var box = {
    x: title_left,
    y: title_top,
    width: title_right - title_left,
    height: title_bottom - title_top,
  }

  context.lineWidth = 6;
  context.strokeRect(box.x,box.y,box.width,box.height);
/**
  var img = new Image();
  img.src = img4
  img.onload = function(){
**/

  var img = new Image();
  img.src = img4
  img.onload = function(){
//    context.drawImage(img, node.x, node.y, node.sizes, node.sizes * img.height / img.width);
    context.drawImage(img, (title_left + title_right)/2 - 150, (title_top + title_bottom)/2 - 45, 300, 300 * img.height / img.width);
  }

  // titleを指定
  context.fillStyle = "black";
//  context.font= 'bold 40px Century Gothic'
//  context.fillText("Pictory", (title_left + title_right)/2 - 80, (title_top + title_bottom)/2);
//  context.fillText(img4, (title_left + title_right)/2 - 80, (title_top + title_bottom)/2);
  context.font= 'bold 20px Century Gothic'
  context.fillText("drop IMAGES!", (title_left + title_right)/2 - 80, (title_top + title_bottom)/2 + 40);



  // ファイルアップローダー  
  elDrop.style.color = "red";
  elDrop.style.left = SCREEN_WIDTH/2 - SCREEN_WIDTH/4 + "px";
  elDrop.style.top = SCREEN_HEIGHT/8 - SCREEN_HEIGHT/12 + 20 + 150 + "px";
  elDrop.style.width = SCREEN_WIDTH/2 - 40 + "px";
  elDrop.style.height = SCREEN_HEIGHT/12 + "px";
/*
  dropHere.style.color = "red";
  dropHere.style.left = SCREEN_WIDTH/2 - SCREEN_WIDTH/4 + "px";
  dropHere.style.top = SCREEN_HEIGHT/8 - SCREEN_HEIGHT/12 + 20 + 150 + "px";
  dropHere.style.width = SCREEN_WIDTH/2 - 40 + "px";
  dropHere.style.height = SCREEN_HEIGHT/12 + "px";
*/


/*
  // Boxの描画
  context.beginPath();
  context.fillStyle = "rgba("+this.rgb1+","+this.rgb2+","+this.rgb3+",0.8)";
  context.strokeStyle = "rgba("+this.rgb1+","+this.rgb2+","+this.rgb3+",0.8)";

  //パスの開始座標を指定する
  context.moveTo(title_left, title_top);
  //座標を指定してラインを引いていく
  context.lineTo(title_right, title_top)
  context.lineTo(title_right, title_bottom);
  context.lineTo(title_left, title_bottom);

  //パスを閉じる（最後の座標から開始座標に向けてラインを引く）
  context.closePath();
  //現在のパスを輪郭表示する
  context.stroke();
//  context.fill();
  context.closePath();
*/

}


// 初回ロード時の◯を生成する。
function createNodes() {
   var node = {
      radius: 1+Math.random()*30|0,
      x: Math.random()*SCREEN_WIDTH,
      y: Math.random()*SCREEN_HEIGHT,
      vx: Math.random()*5-3,
      vy: Math.random()*5-3,
      mass: 1,
      num:star_num,
      g:Math.random(),
      rgb1:Math.random()*255|0,
      rgb2:Math.random()*255|0,
      rgb3:Math.random()*255|0,
      update: function() {
        this.x += this.vx;
        this.y += this.vy;
      },
      //描画
      draw: function() {
        //star
        context.fillStyle = "rgba("+this.rgb1+","+this.rgb2+","+this.rgb3+",0.8)";
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
        context.closePath();
        context.fill();
        
//        context.fillStyle = "white";
//        context.fillText(this.num,this.x,this.y);

      }
    };
    nodes.push(node);
    star_num++;
}


// 円周運動の関数。looperで設定したsetInterval毎に呼び出される。
function loop() {

  // 残像を残さない処理
  //canvas.width = canvas.width;
  //context.clearRect(0,0, canvas.width+1,canvas.height+1);

  //background
  context.fillStyle = 'rgba(255, 255, 255, 0.28)'; //default→ 'rgb(20,20,20)'
  // (0,0)座標からcanvasのwidthとheight分の背景を描画。
  context.fillRect(20, 20, context.canvas.width-40, context.canvas.height-40);
//  context.fillRect(20, 20, 0, 0);
  //nodeの透明度を指定
  //context.globalAlpha = 1-0.99;
  //canvas.width = canvas.width;


  // 生成されているstarの数だけ、配列nodes[i]を指定してupdate＆drawを行う。
  // アップロードされた画像も含む
  for (i=0; i<star_num; i++) {
    nodes[i].update();
    nodes[i].draw();
  }

  // node1とnode2を対象にspring関数を呼び出す。白い糸。
  // spring(node1, node2);
  for (i=0; i<star_num; i++) {
    var node1 = nodes[i];
    for (var j=i+1; j<star_num; j++) {
      var node2 = nodes[j];
    }
    // gravity関数の呼び出し。
    gravity(node1);
  }
   // 初期star2つの描画
   star.update();
//   star2.update();
   star.draw();
//   star2.draw();
    
    //Titleを描画。
    createTitle();
}

function spring(na, nb) {
  // 対象star間の距離を変数dx(y)に代入
  var dx = nb.x - na.x;
  var dy = nb.y - na.y;
  // Math.sqrt：引数として与えた数の平方根を返します。(x^2 + y^2)の平方根 = distance。三平方の定理。  
  var dist = Math.sqrt(dx*dx + dy*dy);
    
    //If the distance between 2 nodes are smaller than minimum, connect them
    // var minDist = 300;で宣言済み。
  if (dist<minDist) {
    context.beginPath();
    context.strokeStyle = "rgba(255,255,255,0.5)"; //白。 最後の引数aは線の太さ。
    // 始点(na)に移動。
    context.moveTo(na.x, na.y);
    // 終点(nb)にlineを引く。
    context.lineTo(nb.x, nb.y);
    // 描画
    context.stroke();
    context.closePath();

    // starの移動速度(vx(y))を設定。
    // var springAmount = 0.0001;で設定済み
    var ax = dx*springAmount;
    var ay = dy*springAmount;
    na.vx += ax;
    na.vy += ay;
    nb.vx -= ax;
    nb.vy -= ay;
  }
}


// loop関数の中でnode1に対して用いている。
function gravity(n) {
    // starからnodeのdistanceをdx(y)に代入
    var dx = star.x - n.x ;
    var dy = star.y - n.y ;
    var dist_by = dx*dx + dy*dy;
    // atan2()：引数の比率でのアークタンジェントを返します。
    var rad =  Math.atan2(dy, dx);
    var  ax = Math.cos(rad)*(GRAVITY/(GRAVITY+dist_by));
    var  ay = Math.sin(rad)*(GRAVITY/(GRAVITY+dist_by));


    var nodeWidth = 0;
    var nodeHeight = 0;
    if (!n.sizes) {
      nodeWidth = n.radius/2;
      nodeHeight = n.radius/2;
    }else{
      nodeWidth = n.sizes;
      nodeHeight = n.sizes;
    }

    // boundary
    if(n.x < 0){
      n.x = 0;
      n.vx *= -0.9;  
    }
    if(n.y < 0){
      n.y = 0;
      n.vy *= -0.9;  
    }
    if(n.x > SCREEN_WIDTH - nodeWidth){
      n.x = SCREEN_WIDTH - nodeWidth;
      n.vx *= -0.9;  
    }
    if(n.y > SCREEN_HEIGHT - nodeHeight){
      n.y = SCREEN_HEIGHT - nodeHeight;
      n.vy *= -0.9;  
    }


    tempCol = "";
    checkCollision(n);

      if (tempCol == "left") {
        n.x += -50;
        n.vx *= -1.1;
      }else if (tempCol == "right") {
        n.x += 50;
        n.vx *= -1.1;
      }else if (tempCol == "top") {
        n.y += -10;
        n.vy *= -1.1;
      }else if (tempCol == "bottom") {
        n.y += 10;
        n.vy *= -1.1;
      }

      n.vx += (ax+ax) /n.mass;
      n.vy += (ay+ay) /n.mass;

      star.vx += (ax+ax)/star.mass/GRAVITY;
      star.vy += (ay+ay)/star.mass/GRAVITY;

}

function checkCollision(n){
  if (!n.sizes) {
//    console.log("x:" + Math.round(n.x) + "y:" + Math.round(n.y) + "n.radius: " + n.radius);
//    console.log("title_left:" + title_left);
  }else{
//    console.log("x:" + Math.round(n.x) + " y:" + Math.round(n.y) + " sizes:" + n.sizes);
    if (n.x >= title_left - n.sizes && n.x < title_left - n.sizes + 10 && n.y >= title_top - 10 && n.y <= title_bottom + 10) {
      tempCol = "left";
    }else if (n.x <= title_right && n.x > title_right - 10 && n.y >= title_top -10 && n.y <= title_bottom + 10) {
      tempCol = "right";
    }else if (n.y >= title_top - n.sizes && n.y < title_top - n.sizes +10 && n.x >= title_left - 10 && n.x <= title_right + 10) {
//    }else if (n.y >= title_top - n.sizes && n.y < title_top - n.width +10 && n.x >= title_left - 10 && n.x <= title_right + 10) {
      console.log("n:" + n + " height:" + n.height + " sizes:" + n.sizes);
      tempCol = "top";
    }else if (n.y <= title_bottom && n.y > title_bottom -10 && n.x >= title_left - 10 && n.x <= title_right + 10) {
      tempCol = "bottom";
    }else{
      return true;
//      console.log("y:" + Math.round(n.y) + "bottom:" + Math.round(title_bottom + n.sizes/2));
//      console.log("nothing...");
    }
  }

  return true;
}

canvas.onclick = function(){
//  createStars();

  if (addedThings.length > 0) {
    def_num += 1;
  }
//  if (nodes.length % 2 == 0) {
    createSnoopy();
//  }else{
//    createWoodstock();
//  }
  // クリックされた回数（nodes）をHTMLの"t"に表示。（画面左下）
  document.getElementById('t').innerHTML= nodes.length;
};





/**      画像アップロード       **/
/*
イベント名 イベントが発生するタイミング  デフォルト動作
dragstart ドラッグ開始時 ドラッグを開始する
drag  ドラッグが継続している間  ドラッグを継続する
dragenter ドラッグ要素がドロップ要素に入った時  ユーザーによるドロップ操作を拒否
dragleave ドラッグ要素がドロップ要素から出た時  何もしない
dragover  ドラッグ要素がドロップ要素に重なっている間 現在のドラッグ操作をリセットする
drop  ドロップ時 （場合による）
dragend ドラッグ終了時 （場合による）
*/


// dragovee：ドラッグ要素がドロップ要素に重なっている間。
elDrop.addEventListener('dragover', function(event) {
    // イベントがキャンセル可能である場合、上位ノードへのイベントの 伝播 (propagation) を止めずに、
    // そのイベントをキャンセルします。
        event.preventDefault();
        // dataTransfer . dropEffect [ = value ] …… 現在の操作の種類を返す（"none", "copy", "link", "move"）。
        // ここでは、"move"を返す。
        event.dataTransfer.dropEffect = 'copy';
        showDropping();
});

// dragleave：ドラッグ要素がドロップ要素から出た時。重なりが外れた時。
elDrop.addEventListener('dragleave', function(event) {
        hideDropping();
});


// drop：ドロップ時。
elDrop.addEventListener('drop', function(event) {
        event.preventDefault();
        hideDropping();

        // JavaScript側では、ドラッグ開始時にDataTransferというオブジェクトにドラッグするデータをセットしておき、
        // ドロップ時にそのデータを取り出して、ドラッグデータをドロップ先へ受け渡すことでドラッグ＆ドロップを実現します。
        // dataTransfer.files …… ドラッグされているファイルがあればファイルリストを返す。
        var files = event.dataTransfer.files;
        showFiles(files);
});

document.addEventListener('click', function(event) {
    var elTarget = event.target;
    if (elTarget.tagName === 'IMG') {
        var src = elTarget.src;
        var w = window.open('about:blank');
        var d = w.document;
        var title = escapeHtml(elTarget.getAttribute('title'));

        d.open();
        d.write('<title>' + title + '</title>');
        d.write('<img src="' + src + '" />');
        d.close();
    }
});

// ドロップ要素に重なっている時の動作。
function showDropping() {
    // 要素のクラスリストへのクラスの追加。id:dropzoneのエレメントにdropoverクラスを追加
        elDrop.classList.add('dropover');
}
// ドロップ要素から重なりが外れた時の動作。 
function hideDropping() {
    // クラスの削除。
        elDrop.classList.remove('dropover');
}

function showFiles(files) {
        elFiles.innerHTML = '';

        for (var i=0, l=files.length; i<l; i++) {
                var file = files[i];
                var elFile = buildElFile(file);
                // appendChild：特定の親ノードの子ノードリストの末尾にノードを追加します。
                // elFiles：親要素名。elFile：親要素の下に追加するノードです。戻り値でもあります。
                elFiles.appendChild(elFile);
        }
}

function buildElFile(file) {
    // li要素を作成し、変数elFileに代入。
        var elFile = document.createElement('li');

        // 画像ファイルの左部に記載する諸情報を取得し、変数textに代入。
        var text = file.name + ' (' + file.type + ',' + file.size + 'bytes)';

        // li要素(親要素)の中にtext(textNode)を加える。
        elFile.appendChild(document.createTextNode(text));

        // file.typeがimageタイプだった場合、"image/png"や"image/jpg"という表記。
        // indexOfは合致していた場合、0を返す。不一致の場合、-1を返す。
        if (file.type.indexOf('image/') === 0) {
          // img要素を生成。
            var elImage = document.createElement('img');
            // srcにはブランクのイメージを入れておく。
            elImage.src = URL_BLANK_IMAGE;
            // elFileの子要素として、elImageを加える。
            // li
            //   -text
            //   img
            //     -elImage
            elFile.appendChild(elImage);
            // file：画像データ。 elImage：imgオブジェクト。中身は空→attachImageでURIデータを入れる。
            attachImage(file, elImage);
        }
//        ここでaddThingsにpushすると、描画が完了しないまま画像データを渡すことになる。
//        そのため、後述のattachImageの中で、readerがファイルを読んだ後に画像データを渡す。
//        addedThings.push(elImage.src);

        return elFile;
}

function attachImage(file, elImage) {
  // FileReader オブジェクトを使うと、ユーザのコンピュータ内にあるファイル（もしくはバッファ上の生データ）を
  // Webアプリケーションから非同期的に読み込むことが出来ます。
  // 読み込むファイルやデータは File ないし Blob オブジェクトとして指定します。
    var reader = new FileReader();
    reader.onload = function(event) {
      // ロード時の各種情報はonloadの引数（この場合はevent）に格納される
    // ロードされた画像ファイルのData URIスキームは event.target.result に格納される
    // 変数srcに格納
        var src = event.target.result; // Data URIスキーム化された画像。
        // 取得した画像ファイルのData URIスキームをelImage.srcに入れるだけ。
        elImage.src = src;
        // title属性を付与。
        elImage.setAttribute('title', file.name);

        addedThings.push(elImage.src);
    };
    // 画像読み込みを実行。"FileReader"の"readAsDataURL"関数を使う
    // 引数はユーザーが入力したファイルのオブジェクト
    reader.readAsDataURL(file);
}


function escapeHtml(source) {
    var el = document.createElement('div');
    el.appendChild(document.createTextNode(source));
    var destination = el.innerHTML;
    return destination;
}

