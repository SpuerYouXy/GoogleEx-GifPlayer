var currentImg;
var currentMask;
var players=[];
var masks=[];

var GifPlayer=function(id,player){
	this.Id=id;
	this.Player=player;
}

var Mask=function(id,mask){
	this.Id=id;
	this.InnerMask=mask;
} 

chrome.extension.onRequest.addListener((request, sender, sendResponse)=>{
	var src =request.src;
	RenderMask(currentImg,src);
});

function RenderMask(img,src){
	if(currentImg){
		if(img.src!=src){
			console.log("出错");
		};
		var id = img.getAttribute("player-mask-id");
		var mask = masks.find(m=>m.Id==id);
		if(mask){
			DisplayMask(id);
		}
		else{
			var id =GenNonDuplicateID(3);
			CreateMask(id);
		}
	}
	else{
		alert("插件加载中...");
		console.log("获取Gif");
	}
}

function CreateMask(id){
	currentImg.setAttribute("player-mask-id",id);
	var img=currentImg;
	
	var width=window.innerWidth;
	var height=window.innerHeight;
	
	// 定位
	var positionDiv = document.createElement("div");
	positionDiv.style.position="fixed";
	positionDiv.style.top=0;
	positionDiv.style.left=0;
	positionDiv.style.width=width+"px";
	positionDiv.style.height=height+"px";
	positionDiv.style.backgroundColor="yellow";
	positionDiv.onclick=function(){
		this.style.display="none";
	}
	
	var maskLeft =(width-img.width)/2;
	var maskTop = (height-img.height)/2;
	
	var mask = document.createElement("div");
	mask.style.position="fixed";
	mask.style.width=img.width+"px";
	mask.style.height=img.height+"px";
	mask.style.top=maskTop+"px";
	mask.style.left=maskLeft+"px";
	
	var tools = GenTools(id);
	
	var cloneImg = img.cloneNode(true);
	
	mask.appendChild(cloneImg);
	mask.appendChild(tools);
	positionDiv.appendChild(mask);
	
	
	document.body.appendChild(positionDiv);
	currentMask=positionDiv;
	var superGif = new SuperGif({gif:cloneImg});
	var gifPlayer =new GifPlayer(id,superGif);
	var gmask = new Mask(id,positionDiv);
	
	players.push(gifPlayer);
	masks.push(gmask);
	superGif.load();
}
function GenNonDuplicateID(randomLength){
  return Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36)
}
function Bind(){
	var imgs = document.getElementsByTagName("img");
	for(img of imgs){
		if(IsGIF(img)){
			img.addEventListener("mouseenter",function(e){
				currentImg=this;
			});
		}
	}
	console.log("绑定完成");
}

function InsertAfter(newElement,targetElement) {
    var parent=targetElement.parentNode;
    if (parent.lastChild==targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement,targetElement.nextSibling);
    }
}

function IsGIF(img){
	var src=img.src.toUpperCase();
	if(src.lastIndexOf(".GIF")>0){
		return true;
	}
	return false;
}

function GenTools(id){
	var tools =document.createElement("div");
	var pre=document.createElement("button");
	pre.innerText="上一帧";
	pre.onclick=function(e){
		PreFrame(id);
		e.stopPropagation();
	};
	var next=document.createElement("button");
	next.innerText="下一帧";
	next.onclick=function(e){
		NextFrame(id);
		e.stopPropagation();
	};
	var closed =document.createElement("button");
	closed.innerText="关闭";
	closed.onclick=function(e){
		CloseMask(id);
		e.stopPropagation();
	};	
	tools.appendChild(pre);
	tools.appendChild(next);
	tools.appendChild(closed);
	return tools;
}

function DisplayMask(id){
	var mask=masks.find(m=>m.Id==id);
	if(mask){
		var innerMask = mask.InnerMask;
		currentMask=innerMask;
		innerMask.style.display="block";
	}
}

function CloseMask(id){
	var mask=masks.find(m=>m.Id==id);
	if(mask){
		var innerMask = mask.InnerMask;
		innerMask.style.display="none";
	}
    //e.preventDefault();
}

function PreFrame(id){
	var player = players.find(p=>p.Id==id);
	if(player){
		var superGif=player.Player;
		superGif.move_relative(-1);
	}
    //e.preventDefault();
}

function NextFrame(id){
	var player = players.find(p=>p.Id==id);
	if(player){
		var superGif=player.Player;
		superGif.move_relative(1);
	}
    //e.preventDefault();
}

window.onload=Bind;
window.onresize=function(){
	if(currentMask){
		var width=window.innerWidth;
		var height=window.innerHeight;
		currentMask.style.width=width+"px";
		currentMask.style.height=height+"px";
	}
}