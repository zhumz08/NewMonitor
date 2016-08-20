#pragma once

// 计算机生成了由 Microsoft Visual C++ 创建的 IDispatch 包装类

// 注意: 不要修改此文件的内容。如果此类由
//  Microsoft Visual C++ 重新生成，您的修改将被覆盖。

/////////////////////////////////////////////////////////////////////////////
// CVodctlctrl1 包装类

class CVodctlctrl1 : public CWnd
{
protected:
	DECLARE_DYNCREATE(CVodctlctrl1)
public:
	CLSID const& GetClsid()
	{
		static CLSID const clsid
			= { 0xE6D58EA6, 0x8F73, 0x4846, { 0x90, 0x40, 0xB4, 0x84, 0x37, 0x2B, 0x42, 0xB0 } };
		return clsid;
	}
	virtual BOOL Create(LPCTSTR lpszClassName, LPCTSTR lpszWindowName, DWORD dwStyle,
						const RECT& rect, CWnd* pParentWnd, UINT nID, 
						CCreateContext* pContext = NULL)
	{ 
		return CreateControl(GetClsid(), lpszWindowName, dwStyle, rect, pParentWnd, nID); 
	}

    BOOL Create(LPCTSTR lpszWindowName, DWORD dwStyle, const RECT& rect, CWnd* pParentWnd, 
				UINT nID, CFile* pPersist = NULL, BOOL bStorage = FALSE,
				BSTR bstrLicKey = NULL)
	{ 
		return CreateControl(GetClsid(), lpszWindowName, dwStyle, rect, pParentWnd, nID,
		pPersist, bStorage, bstrLicKey); 
	}

// 特性
public:


// 操作
public:

// _DVodCtl

// Functions
//

	void LayoutCtl()
	{
		InvokeHelper(0x1, DISPATCH_METHOD, VT_EMPTY, NULL, NULL);
	}
	void SetPlayTimeShow(long ltime)
	{
		static BYTE parms[] = VTS_I4 ;
		InvokeHelper(0x2, DISPATCH_METHOD, VT_EMPTY, NULL, parms, ltime);
	}
	short ClearTimeLine()
	{
		short result;
		InvokeHelper(0x3, DISPATCH_METHOD, VT_I2, (void*)&result, NULL);
		return result;
	}
	short SetCamera(short index, LPCTSTR name, long * id)
	{
		short result;
		static BYTE parms[] = VTS_I2 VTS_BSTR VTS_PI4 ;
		InvokeHelper(0x4, DISPATCH_METHOD, VT_I2, (void*)&result, parms, index, name, id);
		return result;
	}
	short SetHistory(long * id, long pHisData, long count)
	{
		short result;
		static BYTE parms[] = VTS_PI4 VTS_I4 VTS_I4 ;
		InvokeHelper(0x5, DISPATCH_METHOD, VT_I2, (void*)&result, parms, id, pHisData, count);
		return result;
	}
	short SetAlarm(long * id, long * pAlarmData, long count)
	{
		short result;
		static BYTE parms[] = VTS_PI4 VTS_PI4 VTS_I4 ;
		InvokeHelper(0x6, DISPATCH_METHOD, VT_I2, (void*)&result, parms, id, pAlarmData, count);
		return result;
	}
	long getVodTime(short timeType)
	{
		long result;
		static BYTE parms[] = VTS_I2 ;
		InvokeHelper(0x7, DISPATCH_METHOD, VT_I4, (void*)&result, parms, timeType);
		return result;
	}
	void SetSpeed(float fSpeed, short nMsgType)
	{
		static BYTE parms[] = VTS_R4 VTS_I2 ;
		InvokeHelper(0x8, DISPATCH_METHOD, VT_EMPTY, NULL, parms, fSpeed, nMsgType);
	}
	long GetDownloadStart()
	{
		long result;
		InvokeHelper(0x9, DISPATCH_METHOD, VT_I4, (void*)&result, NULL);
		return result;
	}
	long GetDownloadEnd()
	{
		long result;
		InvokeHelper(0xa, DISPATCH_METHOD, VT_I4, (void*)&result, NULL);
		return result;
	}
	long SetCamHisInfo(long lCamIndex, LPCTSTR strCamName, LPCTSTR strCamId, LPCTSTR strHisData, long lRecCount)
	{
		long result;
		static BYTE parms[] = VTS_I4 VTS_BSTR VTS_BSTR VTS_BSTR VTS_I4 ;
		InvokeHelper(0xb, DISPATCH_METHOD, VT_I4, (void*)&result, parms, lCamIndex, strCamName, strCamId, strHisData, lRecCount);
		return result;
	}
	void AboutBox()
	{
		InvokeHelper(DISPID_ABOUTBOX, DISPATCH_METHOD, VT_EMPTY, NULL, NULL);
	}

// Properties
//



};
