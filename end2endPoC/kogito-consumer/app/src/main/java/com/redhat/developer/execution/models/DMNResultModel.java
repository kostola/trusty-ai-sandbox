package com.redhat.developer.execution.models;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

public class DMNResultModel {

    @JsonProperty("executionId")
    public String executionId;

    @JsonProperty("executionDate")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public Date executionDate;

    @JsonProperty("decisions")
    public List<DecisionResultModel> decisions;

    @JsonProperty("context")
    public Map<String, Object> context;

    @JsonProperty("modelNamespace")
    public String modelNamespace;

    @JsonProperty("modelName")
    public String modelName;

    @JsonProperty("modelId")
    public String modelId;

    public Date getExecutionDate() {
        return executionDate;
    }
}

