
// BUDGET CONTROLLER
var budgetController = ( function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
   
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

   var data = {
       allItems: {
           exp: [],
           inc: []
       },
       totals : {
           exp:0,
           inc:0
       }
   };

   return {
       addItem: function(type, des, val) {
            var newItem,Id;

            // create new id;
            if(data.allItems[type].legth > 0){
            Id = data.allItems[type][data.allItems[type].legth -1].id + 1;
            } else {
                Id=0;
            }
           
            if(type === 'exp') {
                newItem = new Expense(Id,des,val);
            } else if(type === 'inc'){
                newItem = new Income(Id,des,val);
            }

            
            data.allItems[type].push(newItem);
            
            
            return newItem;


       },
       testing: function(){
           console.log(data);
       }
   };


})();

// UI CONTROLLER

var UIController = (function(){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list'
    };
    return {
        getInput: function () {

            return {
                 
                 type: document.querySelector (DOMStrings.inputType).value, //will be either inc or exp
                 description: document.querySelector(DOMStrings.inputDescription).value,
                 value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            
            };
        },
        addListItem : function(obj, type) {
            var html, newHtml, element;
            // Create HTml string with placeholder text
            
            if(type === 'inc')
            {
                element=DOMStrings.incomeContainer;
                 html='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if(type === 'exp')
            {
                element=DOMStrings.expensesContainer;
                html='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
           
            // Replace the placeholder text with some actual data
            
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        },

        clearFields: function() {
            var fields,fieldsArr;
            // List of queries
            fields = document.querySelectorAll(DOMStrings.inputDescription + 
                ', ' + DOMStrings.inputValue);
             
                // conversion of list into array
            fieldsArr = Array.prototype.slice.call(fields);
            
            // setting value fields to empty
            fieldsArr.forEach(function(current, index, array) {
                current.value='';
            }); 
            
            // focusing on description
            fieldsArr[0].focus(); 
        },

        getDOMStrings: function () {
            return DOMStrings;
        }
    };


})();

// GLOBAL APP CONTROLLER

var controller = (function(budgetCtrl, UICtrl){

    
    var setupEventListeners = function() {
        
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress', function (event) {
        
        if (event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
        
    });

    };

    var updateBudget = function() {

        // 1. calculate the budget

        // 2. Return the budget

        // 3. Display the budget on th ui
    }
    
    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get the field input data

        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0)
        {
            // 2. Add the item to the budget controller
            newItem = budgetController.addItem(input.type,input.description,input.value);

            // 3. Add the item to the UI
            
            UICtrl.addListItem(newItem , input.type);

            // Clear the fields

            UICtrl.clearFields();

            //5. Calculate and update budget
            updateBudget(); 
        }   
    };

    return {
        init : function() {
            console.log('Application has statrted');
            setupEventListeners();
        }
    }
})(budgetController,UIController);


controller.init();