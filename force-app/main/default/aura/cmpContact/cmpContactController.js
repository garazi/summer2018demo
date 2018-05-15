({
    happyDance : function(component, event, helper) {
        var evt = $A.get("e.c:recordChange");
        evt.setParams({
            "message" : component.get('v.recordId') });
        evt.fire();
    },
    prefillForm : function(component,event,helper){
        var tmpId = event.getParam("message");
        var form = component.find('recordViewForm');
        form.set('v.recordId', tmpId);
    }
})