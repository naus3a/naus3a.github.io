/**
 * @author enrico<naus3a>viola / http://naus3a.ml/
 */

	var sw = 950;
	var sh = 300;

	var renderer;
	var scene;
	var camera;

	var rotClock;
	var tweenScroll;

	var sPanels = new Array(2);
	var sDivs = new Array(2);
	var sIId = new Array(2);

	var curP;

	function initScroller(){
		sIId[0] = "is0";
		sIId[1] = "is1";

		rotClock = new THREE.Clock(false);

		renderer = new THREE.CSS3DRenderer();
		renderer.setSize(sw,sh);
		renderer.setClearColor(0xff0000,1);
		var el = document.getElementById("scroller");
		el.appendChild(renderer.domElement);

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera( 50, sw / sh, 1, 100 );
		camera.position.set( 0, 0, 320 );

		makeScrollPanels();
		setupScrollAnim();

		rotClock.start();
	}

	function setupScrollAnim(){
		tweenScroll = new TWEEN.Tween({x: 0, y: 0});
		tweenScroll.to({x: Math.PI/2, y: 1}, 1000);
		tweenScroll.onUpdate(function(){
			if(curP==0){
				sPanels[0].rotation.x = -this.x;
				sPanels[1].rotation.x = Math.PI/2 - this.x;
				sDivs[0].style.opacity= 1.0-this.y;
				sDivs[1].style.opacity= this.y;
			}else if(curP==1){
				sPanels[0].rotation.x = -Math.PI/2 + this.x;
				sPanels[1].rotation.x = this.x;
				sDivs[1].style.opacity= 1.0-this.y;
				sDivs[0].style.opacity= this.y;
			}
		});
		tweenScroll.onComplete(function(){
			if(curP==1){
				sPanels[0].rotation.x = 0;
				sPanels[1].rotation.x = Math.PI/2;
				curP = 0;
			}else if(curP==0){
				sPanels[0].rotation.x = -Math.PI/2;
				sPanels[1].rotation.x = 0;
				curP = 1;
			}

			this.x = 0;
			this.y = 0;
			tweenScroll.to({x: Math.PI/2, y: 1}, 1000);

			preloadBack();

			rotClock.elapsedTime = 0;
			rotClock.start();
		});
	}

	function animateScroller(){
		requestAnimationFrame(animateScroller);
		updateAutoScroll();
		renderer.render(scene, camera);
	}

	function updateAutoScroll(){
		TWEEN.update();
		if(rotClock.running){
			if(rotClock.getElapsedTime()>=3){
				var other = curP==0?1:0;
				if(isImgLoaded(sIId[other])){
					scroll();
				}
			}
		}
	}

	function scroll(){
		rotClock.elapsedTime = 0;
		rotClock.stop();
		tweenScroll.start();
	}

	function urlForBanner(num){
		var sUrl = "/img/banners/banner"+num+".png";
		return sUrl;
	}

	function makeNewScrollPanel(pIdx, yPivot){
		sDivs[pIdx] = document.createElement('div');
		sDivs[pIdx].style.width = '950px';
		sDivs[pIdx].style.height= '300px';
		sDivs[pIdx].style.position = 'relative';
		//sDivs[pIdx].style.backgroundImage = "url('"+urlForBanner(pIdx+1)+"')";
		//pd.style.opacity = 0.5;
		setScrollerImg(pIdx);
		var po = new THREE.CSS3DObject(sDivs[pIdx]);
		po.position.fromArray([0,-yPivot,0]);
		sPanels[pIdx] = new THREE.Object3D();
		sPanels[pIdx].add(po);
		sPanels[pIdx].position.y = yPivot;
		scene.add(sPanels[pIdx]);

 	}

	function makeScrollPanels(){
		makeNewScrollPanel(0, -sh/2);
		makeNewScrollPanel(1, sh/2);
		sPanels[1].rotation.x = Math.PI/2;
		curP = 0;
	}

	function preloadBack(){
		var other = curP==0?1:0;
		setScrollerImg(other);
	}

	function setScrollerImg(idxP){
		var which = parseInt(Math.random()*(numProj-1));
		which += 1;
		//sDivs[idxP].style.backgroundImage = "url('"+urlForBanner(which)+"')";
		sDivs[idxP].innerHTML = '<img border="0" id="'+sIId[idxP]+'" src="'+urlForBanner(which)+'">';
	}

	function isImgLoaded(iId){
		var wi = document.getElementById(iId);
		if(!wi.complete)return false;
		if(typeof wi.naturalWidth!="undefined" && wi.naturalWidth==0)return false;
		return true;
	}
