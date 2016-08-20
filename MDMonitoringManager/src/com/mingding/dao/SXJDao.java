package com.mingding.dao;

import java.util.List;

import org.springframework.stereotype.Component;

import com.mingding.model.SXJ;

public interface SXJDao {
	public List<SXJ> querySXJ(SXJ sxj);

}
