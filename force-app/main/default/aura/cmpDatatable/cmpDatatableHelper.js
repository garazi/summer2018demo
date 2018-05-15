({
    getData : function(cmp) {
        var action = cmp.get('c.getContacts');
        action.setCallback(this, $A.getCallback(function(response) {
            var state = response.getState();
            console.log(response.getReturnValue());
            if (state === "SUCCESS") {
                var contacts = response.getReturnValue();
                contacts.forEach(element => {
                    element.contactUrl = "/one/one.app#/sObject/" + element.Id;
                });
                    //debugger
                    cmp.set('v.mydata', contacts);
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.error(errors);
            }
        }));
        $A.enqueueAction(action);
    },
    
   saveChanges: function (cmp, draftValues) {
       var self = this;
       var action = cmp.get('c.updateContacts');
       
       action.setParam("draftValues", draftValues);
       action.setCallback(this, $A.getCallback(function (response) {
           var state = response.getState();
           
           if (state === "SUCCESS") {
               var returnValue = response.getReturnValue();
               
               if (Object.keys(returnValue.errors).length > 0) {
                   cmp.set('v.errors', returnValue.errors);
               } else {
                   this.notifications.showToast({
                       variant: 'success',
                       title: returnValue.message,
                   });
                   cmp.set('v.errors', []);
                   cmp.set('v.draftValues', []);
                   cmp.set('v.atomicChanges', []);
                   cmp.set('v.changeIndex', 0);
                   self.clearDraftValuesLS();
                   self.getData(cmp);
               }
           } else if (state === "ERROR") {
               var errors = response.getError();
               console.error(errors);
           }
       }));
       
       $A.enqueueAction(action);
   },
                    
   handleSaveInLocalStorage: function (cmp, event) {
       var checked = event.getParam('checked');
       localStorage.setItem('demo-save-local', JSON.stringify(checked));
       if (checked) {
           this.resolveSaveLocalStorage(cmp);
       } else {
           this.clearDraftValuesLS();
       }
   },
                    
	resolveSaveLocalStorage: function (cmp) {
        //debugger
        var localStorageValue = localStorage.getItem('demo-save-local');
        try {
            var saveLocalStorage = JSON.parse(localStorageValue);
            if (saveLocalStorage) {
            	cmp.set('v.saveLocalStorage', saveLocalStorage);   
            }            
        } catch (e) {
            cmp.set('v.saveLocalStorage', false);
        }
    },
                    
    handleEditCell: function (cmp, event) {
        var saveLocalStorage = cmp.get('v.saveLocalStorage');
        if (saveLocalStorage) {
            var atomicChange = event.getParam('draftValues');
            var atomicChanges = cmp.get('v.atomicChanges');
            atomicChanges.push(atomicChange);
            cmp.set('v.changeIndex', atomicChanges.length);
            
            var draftValues = this.getBuildedDraftValues(atomicChanges, atomicChanges.length);
            
            localStorage.setItem('demo-draft-values', JSON.stringify(atomicChanges));
        }
        
        if (cmp.get('v.autoSaveEnabled')) {
            this.saveChanges(cmp, draftValues);
        }
    },
                    
	getBuildedDraftValues: function (atomicChanges, lastChange) {
        var draftValues = [];
        var mergeChange = function (change, draft) {
            for (var j = 0; j < change.length; j++) {
                var row = false;
                draft.some(function (searchRow) {
                    if (searchRow['Id'] === change[j].Id) {
                        row = searchRow;
                        return true;
                    };
                    return false;
                });
                
                if (row) {
                    Object.assign(row, change[j]);
                } else {
                    draft.push(change[j]);
                }
            }
        }
        
        for (var i = 0; i < lastChange; i++) {
            mergeChange(atomicChanges[i], draftValues)
        }
        
        return draftValues;
    },
                    
	resolveDraftValues: function (cmp) {
        try {
            var atomicChanges = JSON.parse(localStorage.getItem('demo-draft-values'));
            cmp.set('v.draftValues', this.getBuildedDraftValues(atomicChanges, atomicChanges.length));
            cmp.set('v.atomicChanges', atomicChanges);
            cmp.set('v.changeIndex', atomicChanges.length);
        } catch (e) {
            cmp.set('v.draftValues', []);
            cmp.set('v.atomicChanges', []);
            cmp.set('v.changeIndex', 0);
        }
    },
                    
	clearDraftValuesLS: function () {
        localStorage.setItem('demo-draft-values', JSON.stringify([]));
    },
      
	handleAutoSaveChange: function (cmp, event) {
        var checked = event.getParam('checked');
        localStorage.setItem('demo-autosave', JSON.stringify(checked));
    },
      
	resolveAutoSaveValue: function (cmp) {
        //debugger
        var localStorageValue = localStorage.getItem('demo-autosave');
        
        try {
            var saveLocalStorage = JSON.parse(localStorageValue);
            if(saveLocalStorage) {
            	cmp.set('v.autoSaveEnabled', saveLocalStorage);   
            }            
        } catch (e) {
            cmp.set('v.autoSaveEnabled', false);
        }
    },
    toggleCol : function (cmp,event,helper) {
        var btn = cmp.find("newButton");
        var tmp = btn.get("v.label") ;
        ((tmp == "New") ? btn.set("v.label", "Close") : btn.set("v.label", "New"));
		var event = $A.get("e.c:toggleColumn");
		event.fire();
    },                
	deleteRec: function (cmp,event,helper) {
        console.log("fired");
        var tmp = cmp.find("recHandler");
        tmp.deleteRecord();
    }
})