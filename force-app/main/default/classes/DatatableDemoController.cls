public with sharing class DatatableDemoController {
    @AuraEnabled
    public static List<Contact> getContacts() {
        List<Contact> contacts = 
                [SELECT Id, Name, Title, Phone, MailingAddress, Email, Account.Name, DoNotCall FROM Contact];
        return contacts;
    }

    @AuraEnabled
    public static Map<String, Object> updateContacts(List<Contact> draftValues) {
        Map<String, Object> response = new Map<String, Object>();
        Map<String, Object> errors = validate(draftValues);
        
        if (errors.size() > 0) {
            response.put('code', 'ERROR_SAVING');
            response.put('errors', errors);
            return response;
        }
        
        update draftValues;

        response.put('code', 'SUCCESS');
        response.put('errors', errors);
        response.put('message', 'Your changes are saved.');
        
        return response;
    }

    private static Map<String, Object> validate(List<Contact> draftValues) {
        Integer totalErrors = 0;
        Map<String, Object> errors = new Map<String, Object>();
        Map<String, Object> rowsError = new Map<String, Object>();

        for (Contact contact: draftValues) {
            List<String> rowErrorMessages = new List<String>();
            List<String> rowErrorFieldNames = new List<String>();
            
            if (rowErrorMessages.size() > 0) {
                Contact contactWithName = [SELECT Id, Name FROM Contact WHERE Id = :contact.Id];
                Map<String, Object> rowErrors = new Map<String, Object>();

                rowErrors.put('messages', rowErrorMessages);
                rowErrors.put('fieldNames', rowErrorFieldNames);
                rowErrors.put('title', contactWithName.Name + ' has ' + rowErrorMessages.size() + ' errors');

                totalErrors += rowErrorMessages.size();

                rowsError.put((String) Contact.Id, rowErrors);
            }
        }
        
        if (totalErrors > 0) {
            Map<String, Object> table = new Map<String, Object>();
            List<String> tableMessages = new List<String>();

            for (Object rowError: rowsError.values()) {
                String rowErrorTitle = (String)((Map<String, Object>)rowError).get('title');
                
                tableMessages.add(rowErrorTitle);
            }
            table.put('title', 'Some records have errors');
            table.put('messages', tableMessages);
            errors.put('rows', rowsError);
            errors.put('table', table);
        }

        return errors;
    }    
}