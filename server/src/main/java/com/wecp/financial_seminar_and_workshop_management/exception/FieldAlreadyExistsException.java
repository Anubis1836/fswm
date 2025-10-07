package com.wecp.financial_seminar_and_workshop_management.exception;
 
public class FieldAlreadyExistsException extends RuntimeException {
    private String field;
    private String message;
 
    public FieldAlreadyExistsException(String field, String message) {
        super(message);
        this.field = field;
        this.message = message;
    }
 
    public String getField() { return field; }
    @Override
    public String getMessage() { return message; }
}
 
