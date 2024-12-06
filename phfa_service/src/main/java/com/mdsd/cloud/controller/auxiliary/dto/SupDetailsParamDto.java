package com.mdsd.cloud.controller.auxiliary.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * @author WangYunwei [2021-11-19]
 */
@Getter
@Setter
@ApiModel(value = "辅助检查 - 详情_入参")
public class SupDetailsParamDto {
    
    @ApiModelProperty(value = "患者ID")
    private String patientId;
}