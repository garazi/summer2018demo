({
    doInit : function(component,event,helper){
        var declarativeFields=component.get("v.fieldsToDisplay");
        if (declarativeFields) {
            var inputSplit=declarativeFields.split(",");
            for (var i in inputSplit) {
                inputSplit[i]=inputSplit[i].trim();
            }
            component.set("v.myFields", inputSplit);
        }
    },
    happyDance : function(component, event, helper) {
        var evt = $A.get("e.c:recordChange");
        evt.setParams({
            "message" : component.get('v.recordId') });
        evt.fire();
    },
    overrideSave : function(component,event,helper) {
        console.log("override")
        event.preventDefault();
    },
    prefillForm : function(component,event,helper){
        var tmpId = event.getParam("message");
        var form = component.find('recordViewForm');
        form.set('v.recordId', tmpId);
    }
})