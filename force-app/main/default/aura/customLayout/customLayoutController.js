({
    showColumn: function(component,event,helper) {
        var f = component.find("rtCol");
        $A.util.toggleClass(f, "slds-hide");
        var m = component.find("mainCol");
        if (m.get("v.size") == "12") {
            m.set("v.size", "8");
        } else {
            m.set("v.size", "12");
        }
             
    }
})