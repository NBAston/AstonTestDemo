1.命名规范
      1）类名：
	枚举:E
	接口:I
	帮助类:   U
	View类：V
	逻辑类： M
	配置表类:Cfg_		如 Cfg_Path
	命令:Cmd_		如：Cmd_Login
	类名已 类型+类功能英文名  如 URandomhelper; VLobby,MLobby,IState,EGameType
	备注格式 ：
	/**
 	* 创建:gj
 	* 作用：管理http请求
 	*/
	备注创建者名字和类的作用
         
     2) 方法名
	已能表达方法作用的英文单词 小写开头 如 getRoleInfo
	备注：
	 /**
     	* 发送http请求
     	* @param method 
     	* @param data 
	*/
	备注方法的作用 以及参数的作用

     3）字段名
	公共字段 用能表达字段意思的英文字母 如: hp
	私有字段 用_开头加上用能表达字段意思的英文字母 如 _gold
	
	备注：
	/**
     	* 玩家的血量
     	*/
	备注字段的意思
     4)常量
	能表达常量意思的英文字母 全部大写 如：MAX_PLAYER
2.项目目录结构
	scene : 场景
	script：已功能模块为单位划分文件夹
		hall：大厅
		game：游戏
			已单个游戏问目录如
			zJh
			niuniu
		common：共有
			utility：帮助
			net：网络请求
			jslib:存放js库
	resources：存放需要动态加载的资源
		common:
			prefab:预制件
			tex:图片
			audio:音效	
		game:
			niuniu:
				prefab:预制件
				tex:图片
				audio:音效
			
	texture：存放不需要动态加载的资源
		按模块划分
		common：共有资源
	             game:
			niuniu：
				anim：动画文件
				font :字体
				tex  :图片
	anim：
		common：共有
		game：	
			niuniu
				录制的UI缓动动画
	testdemo：放置测试用途的东西

3.资源命名规则
	按钮资源:
		btn_按钮作用_n  		n表示一般状态 如 （btn_regester_n)
		btn_按钮作用_h  		h表示悬停状态	（btn_regester_h)
		btn_按钮作用_p  		p表示按下状态	（btn_regester_p)
		btn_按钮作用_d  		d表示禁用状态	（btn_regester_d)
	图片:
	  	img_图片作用       	一般图片一般图片 如： img_hotsell  //热销标签
		img_图片作用_n   	九宫格图片	  如:    img_back_n //需要九宫格拉伸的背景灰底
	美术字:
		font_字意思_数字    	美术字图片(字的意思可以是用途)  如 font_timeout_1 超时的美术字
	Icon图:
		icon_图片类型_数字 	icon图（数字可以是对于物品的itemid） icon_head_1 头像1的图片
	动画 :
		spine动画
			anim_spine_动画名字.json
			anim_spine_动画名字.atlas
			anim_spine_动画名字.png
		龙骨
			anim_dragon_动画名字.json
			anim_dragon_动画名字.atlas
			anim_dragon_动画名字.png
		录制的缓动动画
			anim_cos_动画名字
	音频:
		audio_音频类型_音频名字	如扎金花背景音乐  audio_music_zjh 开始按钮 audio_sound_start
	配置表:
		cfg_配置表名字  cfg_path.json