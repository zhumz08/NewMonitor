package com.mingding.model;

public class SXJ {
	private Integer id;
	private String gbbh;//国标编号
	private String sheng;//所属省份
	private String shi;//所属市
	private String qu;//所属区
	private String suo;//所属派出所
	private String mc;//摄像机名称
	private String txdz;//摄像机通信ip地址
	private Integer txdk;//摄像机端口
	private String wzms;//摄像机位置描述
	private String jd;//经度
	private String wd;//纬度
	private Integer lkxxid;//路口信息id
	private Integer lkxxwzx;//路口信息位置x
	private Integer lkxxwzy;//路口信息位置y
	private Integer dwxxid;//点位信息id
	private Integer fzid1;//分组id1
	private Integer fzid2;//
	private Integer fzid3;//
	private Integer fzid4;//
	private Integer fzid5;//
	private Integer fzid6;//
	private Integer fzid7;//
	private Integer fzid8;//
	private Integer fwqid;//当前接入服务器的id
	private Integer sfkk;//是否可控
	private Integer sxjlx;//摄像机类型
	private Integer azwz;//安装位置
	private Integer yt;//用途
	private Integer jkfw;//监视方位
	private Integer xylx;//协议类型
	private String xydz;//协议url地址
	private String yhm;//用户名
	private String mm;//密码
	private Integer bmcsid;//编码参数表id
	private Integer txzqjbxxid;//图像增强基本信息表id
	private Integer txtjxxid;//图像调节信息表id
	private Integer lxccjhid;//录像存储计划表id
	
	public SXJ() {
	}
	
	public SXJ(Integer id, String gbbh, String sheng, String shi,
			String qu, String suo, String mc, String txdz, Integer txdk) {
		super();
		this.id = id;
		this.gbbh = gbbh;
		this.sheng = sheng;
		this.shi = shi;
		this.qu = qu;
		this.suo = suo;
		this.mc = mc;  
		this.txdz = txdz;
		this.txdk = txdk;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getGbbh() {
		return gbbh;
	}
	public void setGbbh(String gbbh) {
		this.gbbh = gbbh;
	}
	public String getSheng() {
		return sheng;
	}
	public void setSheng(String sheng) {
		this.sheng = sheng;
	}
	public String getShi() {
		return shi;
	}
	public void setShi(String shi) {
		this.shi = shi;
	}
	public String getQu() {
		return qu;
	}
	public void setQu(String qu) {
		this.qu = qu;
	}
	public String getSuo() {
		return suo;
	}
	public void setSuo(String suo) {
		this.suo = suo;
	}
	public String getMc() {
		return mc;
	}
	public void setMc(String mc) {
		this.mc = mc;
	}
	public String getTxdz() {
		return txdz;
	}
	public void setTxdz(String txdz) {
		this.txdz = txdz;
	}
	public Integer getTxdk() {
		return txdk;
	}
	public void setTxdk(Integer txdk) {
		this.txdk = txdk;
	}
	public String getWzms() {
		return wzms;
	}
	public void setWzms(String wzms) {
		this.wzms = wzms;
	}
	public String getJd() {
		return jd;
	}
	public void setJd(String jd) {
		this.jd = jd;
	}
	public String getWd() {
		return wd;
	}
	public void setWd(String wd) {
		this.wd = wd;
	}
	public Integer getLkxxid() {
		return lkxxid;
	}
	public void setLkxxid(Integer lkxxid) {
		this.lkxxid = lkxxid;
	}
	public Integer getLkxxwzx() {
		return lkxxwzx;
	}
	public void setLkxxwzx(Integer lkxxwzx) {
		this.lkxxwzx = lkxxwzx;
	}
	public Integer getLkxxwzy() {
		return lkxxwzy;
	}
	public void setLkxxwzy(Integer lkxxwzy) {
		this.lkxxwzy = lkxxwzy;
	}
	public Integer getDwxxid() {
		return dwxxid;
	}
	public void setDwxxid(Integer dwxxid) {
		this.dwxxid = dwxxid;
	}
	public Integer getFzid1() {
		return fzid1;
	}
	public void setFzid1(Integer fzid1) {
		this.fzid1 = fzid1;
	}
	public Integer getFzid2() {
		return fzid2;
	}
	public void setFzid2(Integer fzid2) {
		this.fzid2 = fzid2;
	}
	public Integer getFzid3() {
		return fzid3;
	}
	public void setFzid3(Integer fzid3) {
		this.fzid3 = fzid3;
	}
	public Integer getFzid4() {
		return fzid4;
	}
	public void setFzid4(Integer fzid4) {
		this.fzid4 = fzid4;
	}
	public Integer getFzid5() {
		return fzid5;
	}
	public void setFzid5(Integer fzid5) {
		this.fzid5 = fzid5;
	}
	public Integer getFzid6() {
		return fzid6;
	}
	public void setFzid6(Integer fzid6) {
		this.fzid6 = fzid6;
	}
	public Integer getFzid7() {
		return fzid7;
	}
	public void setFzid7(Integer fzid7) {
		this.fzid7 = fzid7;
	}
	public Integer getFzid8() {
		return fzid8;
	}
	public void setFzid8(Integer fzid8) {
		this.fzid8 = fzid8;
	}
	public Integer getFwqid() {
		return fwqid;
	}
	public void setFwqid(Integer fwqid) {
		this.fwqid = fwqid;
	}
	public Integer getSfkk() {
		return sfkk;
	}
	public void setSfkk(Integer sfkk) {
		this.sfkk = sfkk;
	}
	public Integer getSxjlx() {
		return sxjlx;
	}
	public void setSxjlx(Integer sxjlx) {
		this.sxjlx = sxjlx;
	}
	public Integer getAzwz() {
		return azwz;
	}
	public void setAzwz(Integer azwz) {
		this.azwz = azwz;
	}
	public Integer getYt() {
		return yt;
	}
	public void setYt(Integer yt) {
		this.yt = yt;
	}
	public Integer getJkfw() {
		return jkfw;
	}
	public void setJkfw(Integer jkfw) {
		this.jkfw = jkfw;
	}
	public Integer getXylx() {
		return xylx;
	}
	public void setXylx(Integer xylx) {
		this.xylx = xylx;
	}
	public String getXydz() {
		return xydz;
	}
	public void setXydz(String xydz) {
		this.xydz = xydz;
	}
	public String getYhm() {
		return yhm;
	}
	public void setYhm(String yhm) {
		this.yhm = yhm;
	}
	public String getMm() {
		return mm;
	}
	public void setMm(String mm) {
		this.mm = mm;
	}
	public Integer getBmcsid() {
		return bmcsid;
	}
	public void setBmcsid(Integer bmcsid) {
		this.bmcsid = bmcsid;
	}
	public Integer getTxzqjbxxid() {
		return txzqjbxxid;
	}
	public void setTxzqjbxxid(Integer txzqjbxxid) {
		this.txzqjbxxid = txzqjbxxid;
	}
	public Integer getTxtjxxid() {
		return txtjxxid;
	}
	public void setTxtjxxid(Integer txtjxxid) {
		this.txtjxxid = txtjxxid;
	}
	public Integer getLxccjhid() {
		return lxccjhid;
	}
	public void setLxccjhid(Integer lxccjhid) {
		this.lxccjhid = lxccjhid;
	}
	
}
