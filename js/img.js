// JavaScript Document
/*
author : mengjia
version : 1.0
方法：
	go(index)：将指定序号滚动到中间，序号从0开始
	setIndex(index)：将指定序号跳转到中间，无动画，序号从0开始
	setLeftIndex(index)：将指定序号跳转到最左边，无动画，序号从0开始
	pre()：向前滚动一张
	next()：向后滚动一张
	init()：初始化

HTML代码结构说明：
	为了网站的SEO效果，图片数据，描述信息等均放置到HTML代码中，其结构如下：

	<img src=""/>
	<div>这里放置对前一张图片的描述信息</div>
	<img src=""/>
	<div>这里放置对前一张图片的描述信息</div>

	如果图片有链接，则需要给图片添加上<a>标签，如下所示：
	<a href="" target=""><img src=""/></a>
	<div>这里放置对前一张图片的描述信息</div>
	<img src=""/>
	<div>这里放置对前一张图片的描述信息</div>
可以参考相关示例DEMO文件
*/

(function(){
	var sina = {
		$ : function(objName){if(document.getElementById){return eval('document.getElementById("'+objName+'")')}else{return eval('document.all.'+objName)}},
		//Event
		addEvent : function(obj,eventType,func){if(obj.attachEvent){obj.attachEvent("on" + eventType,func);}else{obj.addEventListener(eventType,func,false)}},
		delEvent : function(obj,eventType,func){
			if(obj.detachEvent){obj.detachEvent("on" + eventType,func)}else{obj.removeEventListener(eventType,func,false)}
		},
		// 获取下一个非空节点
		next : function(el){
			var next = el.nextSibling;
			while(next && next.nodeType != 1){
				next = next.nextSibling;
			}
			return next;
		},
		extend : function(o,t){
			for (var p in t){
				o[p] = t[p];
			}
			return o;
		},
		/**
		 * 设置元素的css样式
		 */
		css : function(o,s){
			var t = o.style;
			for (var p in s){
				t[p] =s[p];
			}
			return o;
		},
		getCurrIndex : function(len,curr){
			if(curr >= len)
				curr -= len;
			if(curr <0)
				curr += len;
			return curr;
		},
		// 获取数组的某个元素
		getArrEl : function(arr,curr){
			return arr[this.getCurrIndex(arr.length,curr)];
		},
		supportTransition : (function(){
			// 这里只是简单的判断一个是否是webkit内核
			return window.navigator.userAgent.toLowerCase().indexOf("webkit")>=0;
		})(),
		/*
		 * 动画工具，元素elem从当前状态运行到to样式状态，花费time和时间
		 * 注：需要使用setTimeout 0 是为了以上javascript执行器一直占用UI线程，导致元素的CSS动画得不到所需要的效果。其中一个例子就是：当设置Duration为0时，如果后面的代码再有设置Duration不为0的，则执行时CSS的Duration为0不生效。这是由于js执行时长时间占用UI线程，导致页面渲染前WebkitTransitionDuration已经不为0了。
		 */
		transition : function(elem,to,time){
			setTimeout(function(){
				sina.css(elem,{
					display : "",
					WebkitTransform : "translate3d(0,0,0)",
					//WebkitTransitionTimingFunction : "linear",
					WebkitTransitionDuration : time
				});
				sina.css(elem,to);
				sina.css(elem.imgObj,{
					WebkitTransform : "translate3d(0,0,0)",
					//WebkitTransitionTimingFunction : "linear",
					WebkitTransitionDuration : time
				});
				sina.css(elem.imgObj,to.imgObj);
			},0);
		}
	};

	var d = document,w = this, b = d.body, h = d.documentElement;
	var scrollPic3D = function(){};
	scrollPic3D.prototype = {
		boxId : '', //容器id
		width : 500, //容器宽度
		height : 100, //容器高度
		imgWidth : 90, //图片宽度
		imgHeight : 120, //图片高度
		descHeight : 100,
		descClass : "picdesc",
		showsNumber : 9, //显示数量
		zoom : 0.8, //小图缩放比
		data : [],
		position : [],
		timeLimit : 200, //动画时间，100毫秒
		leftIndex : 0,//最左边图片的数据下标
		autoPlay : true, //是否自动播放
		autoPlayTime : 9, //自动播放时间间隔
		version : "1.0",
		author : "mengjia",
		init : function(){
			this.initData();
			if(this.data.length < this.showsNumber){alert('错误：滚动图片数据小于显示数据');return};
			if(this.showsNumber % 2 == 0){this.showsNumber++}; //保证是奇数
			var boxEl = sina.$(this.boxId);
			boxEl.style.width = this.width + 'px';
			boxEl.style.height = this.height + 'px';
			boxEl.style.position = 'relative';
			boxEl.style.overflow = 'hidden';
			boxEl.style.zoom = 1;
			this.setLeftIndex(0);
			this.showDesc(this.index);// 显示初始化模块的信息
			this.ifDestory();
		},
		/*
		 * 销毁页面时的数据删除处理，防止内存泄露
		 */
		ifDestory : function(){
			var thisObj = this;
			sina.addEvent(w,"unload",function(){
				delete thisObj.data;
			});
		},
		/*
		 * 初始化数据，把目标窗口this.boxId中的所有image元素做为需要动态显示的图片元素，每一个元素的下一个节点是其描述信息，会添加到新创建的节点中做显示处理。如果这个图片没有描述信息，则添加空节点
		 * 
		 */
		initData : function(){
			// 处理所有img元素
			var boxEl = sina.$(this.boxId);
			// 添加相应的操作元素和显示描述的元素
			var descEl = d.createElement("div");
			descEl.id = this.descId = "descEL-"+ (+new Date());
			descEl.className = "imgDesc_";
			descEl.style.position = "absolute";
			descEl.style.height = this.descHeight + "px";
			descEl.style.bottom = 20+"px";
			descEl.style.width = "100%";
			boxEl.appendChild(descEl);

			var objs = boxEl.childNodes,obj,imgObj;
			var imgObjs = boxEl.getElementsByTagName("img"),imgObj,tempThis = this;
			for (var i = 0,j=0,len = objs.length; i < len; i++){
				obj = objs[i];
				if(obj.tagName != "DIV")continue;
				//obj.num = i;
				obj.style.position = 'absolute';
				imgObj = obj.getElementsByTagName("img")[0];
				// 如果没有图片，则跳过
				if(!imgObj)continue;
				obj.imgObj = imgObj;
				imgObj.num = obj.num = j++;
				imgObj.style.width = "100%";
				imgObj.style.height = "100%";

//				sina.addEvent(imgObj,"click",function(e){
//					e = e || w.event;
//					var tar = e.target || e.srcElement;
//					// 如果当前页面正是焦点图，则可弹出页面
//					tempThis.go(tar.num);
//					if(tempThis.index != tar.num){
//						if ( e.preventDefault ) {
//							e.preventDefault();
//						}
//						if ( e.stopPropagation ) {
//							e.stopPropagation();
//						}
//						return false;
//					}
//				});
				// 把对图片相应的描述内容放置到descEl元素中
				var next = this._getDescEl(obj);
				if(!next){
					next = d.createElement("div");
				}
				next.style.display = "none";
				descEl.appendChild(next);
				this.data.push(obj);
			}
		},
		/*
		 * 显示前一个图片，有动画
		 * 
		 */
		pre : function(){
			  this.go(this.index - 1);
		},
		/*
		 * 显示下一个图片，有动画
		 * 
		 */
		next : function(){
			  this.go(this.index + 1);
		},
		/*
		 * 自动播放函数，通过this.autoPlay属性控制
		 * 
		 */
		pre_r : function(num){
			  this.go(num);
		},
		next_r : function(num){
			  this.go(num);
		},
		
		autoPlayFunc : function(){
			if(this.autoPlay){
				clearInterval(this._autoPlay);
				var tempThis = this;
				this._autoPlay = setInterval(function(){tempThis.next();},this.autoPlayTime*1000);
			};
		},
		/*
		 * css3的移动到下一个的动画实现函数
		 * @param clockwise {Boolean} 是顺时针还是逆时针运动
		 * @param time {Number} 执行这次动画所需要的时间
		 * 
		 */
		transNext : function(clockwise,time){
			var datas = this.data,leftIndex = this.leftIndex,posArr = this.position,len = this.showsNumber,pos,elem,

				//获取需要提前准备的元素
				el = sina.getArrEl(datas,clockwise?leftIndex+len : leftIndex-1),
				// 获取该元素所对应的样式
				s = sina.getArrEl(posArr,clockwise?posArr.length-1:0);
			// 立即应用该样式
			sina.transition(el,s,"0s");
			for (var i = 0; i <= len; i++){
				// 获取当前对应的元素
				elem = sina.getArrEl(datas,clockwise?i+leftIndex:i-1+leftIndex);
				//给对应的元素设置对应的位置信息，同时指定css动画的时间
				pos = sina.getArrEl(posArr,clockwise?i:i+1);
				sina.transition(elem,pos,time+"ms");
			}
			// 设置leftIndex和index值
			this.leftIndex = sina.getCurrIndex(datas.length,clockwise?leftIndex+1:leftIndex-1);
			this.index = sina.getCurrIndex(datas.length,this.leftIndex + Math.floor(len / 2));
		},

		/*
		 * 把中间的图片设置成第下标为index的图片，有动画
		 * @param index {Integer} 目标图片对应的下标值
		 * @example 
		 * 例如：需要显示第2副图的描述信息，则===> go(1)，则会产生动画效果
		 * 
		 */
		go : function(index){
			if(this.index == index){return;};
			var start = this.index, end = index, len = this.data.length;
			clearTimeout(this._timeout);

			//最短路程
			if(Math.abs(end - start) > len / 2){
				if(end > len / 2){
					end = end - len;
				}else{
					end = end + len;
				};
			};
			// 根据是否支持css3动画 分别做处理
			this[sina.supportTransition?"_css3Animate":"_jsAnimate"](end);
		},
		/*
		 * css3 Transition动画实现函数，传入结束值,开始产生动画
		 *
		 */
		_css3Animate : function(end){
			var obj = this,start = this.index, length = Math.abs(end - start),
				stepTime = this.timeLimit / length;

			this._timeout = setTimeout(function(){
				if(!length--){//根据路程做多个timeout调用
					if(obj.onend){obj.onend(start,obj.index)};
					return;
				}
				obj.transNext(end > start,stepTime);
				obj._timeout = setTimeout(arguments.callee,stepTime/2);
			},0);
		},
		/*
		 * js动画实现函数，传入结束值,开始产生动画
		 *
		 */
		_jsAnimate : function(end){
			//步数
			var step = this.timeLimit / 20, obj = this, start = this.index, now = 0;
			this._timeout = setTimeout(function(){
				var index = obj.index;
				if(now >= step){
					if(index != Math.round(index))
						obj.go(Math.round(index));
					if(obj.onend){obj.onend(start,index)};
					return;
				};
				now ++;
				var t = now;
				// 设置动画运行特效，三次方函数
				var value = ((end - start)*((t=t/step-1)*t*t + 1))+ start;
				obj.setIndex(value);
				obj._timeout = setTimeout(arguments.callee,20);
			},20);
		},
		/*
		 * 获取当前图片对应的描述元素
		 * @param {HTMLDomElement} 图片元素对应的HTMLDomElement
		 * 
		 */
		_getDescEl : function(obj){
			var nodes = obj.childNodes,node;
			for (var i = 0,len = nodes.length; i < len; i++){
				node = nodes[i];
				if(node && node.className &&　node.className.indexOf(this.descClass) >= 0)
					return node;
			}
			return null;
			/*var pNode = imgEl.parentNode,
				next = sina.next(pNode.tagName.toLowerCase() == "a"?pNode :imgEl),
				tagName = next?next.tagName.toLowerCase():"";

			// 需要显示新图片的描述信息

			if(!next || (next && (tagName == "img" || tagName == "a" || next.id == this.descId))){
				// 没有描述元素，返回空
				return null;
			}
			return next;
			*/
		},
		/*
		 * 只显示当前下标图片对应的描述信息
		 * @param {Integer} 当前图片对应的下标值
		 * @example 
		 * 例如：需要显示第2副图的描述信息，则===> showDesc(1)
		 * 
		 */
		showDesc : function(currIndex){
			var children = sina.$(this.descId).childNodes;
			for (var i = 0,len = children.length; i < len; i++){
				children[i].style.display = i == currIndex?"":"none";
			}
		},
		/*
		 * 图片轮转完成后触发的动作
		 * @param preIndex {Integer} 原来图片的下标
		 * @param currIndex {Integer} 当前图片的下标
		 * TODO 可以做一些动画效果，例如描述信息的淡入淡出等
		 * 
		 */
		onend : function(preIndex , currIndex){
			// TODO 可以做动画过渡效果
			currIndex = Math.round(currIndex);
			if(currIndex >= this.data.length){
				currIndex = currIndex - this.data.length;
			}
			this.showDesc(currIndex);
		},
		/*
		 * 设置当前下标的值作为中间图片，无动画
		 * @param index {Integer} 图片的下标
		 * 
		 */
		setIndex : function(index){
			this.setLeftIndex(index - Math.floor(this.showsNumber/2));
		},
		/*
		 * 设置当前下标的值作为最左边图片，无动画
		 * @param leftIndex {Integer} 图片的下标
		 * 
		 */
		setLeftIndex : function(leftIndex){
			var picLen = this.data.length,half = this.showsNumber/2,getIndex = sina.getCurrIndex;
			//避免浮点运算的bug
			leftIndex = Math.round(leftIndex * 1000) / 1000;
			leftIndex = getIndex(picLen,leftIndex);
			this.leftIndex = leftIndex;

			var index = getIndex(picLen,Math.floor(half) + leftIndex);
			this.index = index;

			for(var i=0;i<picLen;i++){
				if(this.data[i]){
					this.data[i].style.display = 'none';
				};
			};
			var tempThis = this,obj,w,h,t,l,z;
			for(var i=0,len = (this.showsNumber == this.data.length)?this.showsNumber-1:this.showsNumber;i<=len;i++){
				var pos = getIndex(picLen,leftIndex + i);
				pos = Math.floor(pos);//用于数据下标

				var pos_f = i - leftIndex + Math.floor(leftIndex); //浮点位置，允许为小数
				var size = (half - Math.abs(pos_f - half + 0.5));
				var zIndex = Math.ceil(size);
				obj = this.data[pos];
				obj.style.display = '';
				obj.style.zoom = 1;

				var zoom = Math.abs(this.zoom + (1 - this.zoom) / half * size);
				// 设置图片的宽高
				w = Math.round(this.imgWidth * zoom);
				h = Math.round(this.imgHeight * zoom);

				var imgObj = obj.imgObj;
				imgObj.style.width = w + 'px';
				imgObj.style.height = h + 'px';
				imgObj.style.zoom = 1;

				// 设置图片的宽度

				var imgW = imgObj.offsetWidth, imgH = imgObj.offsetHeight, imgBorder = imgW - w;
				obj.style.width = imgW + "px";
				obj.style.height = imgH + "px";
				var objW = obj.offsetWidth,objH = obj.offsetHeight,objBorder = objW - imgW;

				// 设置图片的位置信息，只记录left值
				l = (this.width / 2 - (this.imgWidth + objBorder) / 2) / (half - 0.5) * (size - 0.5) ;

				l = half > i? l : this.width - l - objW;
				obj.style.left = l + "px";

				t = Math.round((this.height - objH - this.descHeight) / 2 );
				obj.style.top = t + 'px';

				obj.style.zIndex = z = Math.round(zIndex);
				//setTimeout(function(){
				obj.style.zoom = 1;
				imgObj.style.zoom = 1;
				//},0);
				// 这里保存初始时所有确定的图片位置大小等信息
				if(sina.supportTransition && !this.position[i]){
					this.position[i] = {
						zIndex:z*100,// 放大zindex
						left:l + "px",
						top:t+"px",
						width:imgW +"px",
						height:imgH+"px",
						imgObj : {
							width : w + "px",
							height : h + "px"
						}
					}
				};
			}
			// 保存显示元素前一个和最后一个的位置
			if(sina.supportTransition && this.position.length != this.showsNumber+2){
				var temp = this.position[0];
				this.position.unshift(sina.extend(sina.extend({},temp),{
					left : "-"+temp.width,
					zIndex : 0
				}));
				this.position[this.position.length-1] = sina.extend(sina.extend({},temp),{
					left : this.width+"px",
					zIndex : 0
				});
			};
			this.autoPlayFunc();
		}
	};
	w.scrollPic3D = scrollPic3D;
})();