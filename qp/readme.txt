1.�����淶
      1��������
	ö��:E
	�ӿ�:I
	������:   U
	View�ࣺV
	�߼��ࣺ M
	���ñ���:Cfg_		�� Cfg_Path
	����:Cmd_		�磺Cmd_Login
	������ ����+�๦��Ӣ����  �� URandomhelper; VLobby,MLobby,IState,EGameType
	��ע��ʽ ��
	/**
 	* ����:gj
 	* ���ã�����http����
 	*/
	��ע���������ֺ��������
         
     2) ������
	���ܱ�﷽�����õ�Ӣ�ĵ��� Сд��ͷ �� getRoleInfo
	��ע��
	 /**
     	* ����http����
     	* @param method 
     	* @param data 
	*/
	��ע���������� �Լ�����������

     3���ֶ���
	�����ֶ� ���ܱ���ֶ���˼��Ӣ����ĸ ��: hp
	˽���ֶ� ��_��ͷ�������ܱ���ֶ���˼��Ӣ����ĸ �� _gold
	
	��ע��
	/**
     	* ��ҵ�Ѫ��
     	*/
	��ע�ֶε���˼
     4)����
	�ܱ�ﳣ����˼��Ӣ����ĸ ȫ����д �磺MAX_PLAYER
2.��ĿĿ¼�ṹ
	scene : ����
	script���ѹ���ģ��Ϊ��λ�����ļ���
		hall������
		game����Ϸ
			�ѵ�����Ϸ��Ŀ¼��
			zJh
			niuniu
		common������
			utility������
			net����������
			jslib:���js��
	resources�������Ҫ��̬���ص���Դ
		common:
			prefab:Ԥ�Ƽ�
			tex:ͼƬ
			audio:��Ч	
		game:
			niuniu:
				prefab:Ԥ�Ƽ�
				tex:ͼƬ
				audio:��Ч
			
	texture����Ų���Ҫ��̬���ص���Դ
		��ģ�黮��
		common��������Դ
	             game:
			niuniu��
				anim�������ļ�
				font :����
				tex  :ͼƬ
	anim��
		common������
		game��	
			niuniu
				¼�Ƶ�UI��������
	testdemo�����ò�����;�Ķ���

3.��Դ��������
	��ť��Դ:
		btn_��ť����_n  		n��ʾһ��״̬ �� ��btn_regester_n)
		btn_��ť����_h  		h��ʾ��ͣ״̬	��btn_regester_h)
		btn_��ť����_p  		p��ʾ����״̬	��btn_regester_p)
		btn_��ť����_d  		d��ʾ����״̬	��btn_regester_d)
	ͼƬ:
	  	img_ͼƬ����       	һ��ͼƬһ��ͼƬ �磺 img_hotsell  //������ǩ
		img_ͼƬ����_n   	�Ź���ͼƬ	  ��:    img_back_n //��Ҫ�Ź�������ı����ҵ�
	������:
		font_����˼_����    	������ͼƬ(�ֵ���˼��������;)  �� font_timeout_1 ��ʱ��������
	Iconͼ:
		icon_ͼƬ����_���� 	iconͼ�����ֿ����Ƕ�����Ʒ��itemid�� icon_head_1 ͷ��1��ͼƬ
	���� :
		spine����
			anim_spine_��������.json
			anim_spine_��������.atlas
			anim_spine_��������.png
		����
			anim_dragon_��������.json
			anim_dragon_��������.atlas
			anim_dragon_��������.png
		¼�ƵĻ�������
			anim_cos_��������
	��Ƶ:
		audio_��Ƶ����_��Ƶ����	�����𻨱�������  audio_music_zjh ��ʼ��ť audio_sound_start
	���ñ�:
		cfg_���ñ�����  cfg_path.json