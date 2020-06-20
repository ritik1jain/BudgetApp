
// BUDGET CONTROLLER
var budgetController = ( function() {

    // Constructors
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
   
    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome)*100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    // Data structure
   var data = {
       allItems: {
           exp: [],
           inc: []
       },
       totals : {
           exp:0,
           inc:0
       },
       budget: 0,
       percentage: -1
   };
    
   //    private methods
   var calculateTotal = function(type) {
        var sum = 0;
        
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });

        data.totals[type] = sum;
    
        
   }
//    public methods
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
       deleteItem:function(type,id) {
        var ids,index;

            ids = data.allItems[type].map(function(cur) {
                return cur.id
            });

            index = ids.indexOf(id);

            if(index !== -1)
            {
                data.allItems[type].splice(index,1);
            }
       },

       calculateBudget: function() {

            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate bubdget: income - expense

            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
            }else {
                data.percentage = -1;
            }
            },
        

            calculatePercentages: function() {

                data.allItems.exp.forEach(function(cur){
                    cur.calcPercentage(data.totals.inc);
                });
            },

            getPercentages : function() {
                var allPerc;
                allPerc = data.allItems.exp.map(function(cur){
                    return cur.getPercentage();
                });
                return allPerc;
            },

        getBudget: function() {
                return {
                    budget: data.budget,
                    totalInc: data.totals.inc,
                    totalExp: data.totals.exp,
                    percentage: data.percentage
                };
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
        expensesContainer:'.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    var formatNumber = function(num, type) {

        var numsplit,int,dec,type;
        /*
        + or - before number
        exactly 2 decimal points
        comma separating the thousands
         */
        num = Math.abs(num);
        num = num.toFixed(2);

        numsplit = num.split('.');

        int = numsplit[0];
        dec = numsplit[1];
        if(int.legth > 3)
        {
            int = int.substr(0, int.legth - 3) + ',' + int.substr(int.length - 3,3);

        }

        

        return (type === 'exp' ?  '-' : '+') + ' ' + int + '.' + dec;

    };
    var nodeListForEach = function(list,callback) {
        for(var i=0; i<list.length; i++)
        {
            callback(list[i],i);
        }
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
                 html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if(type === 'exp')
            {
                element=DOMStrings.expensesContainer;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
           
            // Replace the placeholder text with some actual data
            
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value, type));

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        },

        deleteListItem: function(itemId) {
            var element = document.getElementById(itemId);
            element.parentNode.removeChild(element);
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
        displayBudget : function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp , 'exp');
            
            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            
            }
        },

        displayPercentages : function(percentages) {

            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
            

            nodeListForEach(fields, function(current,index){
                if(percentages[index] > 0) {
                current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        }, 

        displayMonth: function() {
             var now, year, month,months;
            now = new Date();
            months = ['January','Feburary','March','April','May','June','July','August','September','October','November','December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
            
            
            
        },
        changedType: function() {

            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue
            );
                nodeListForEach(fields,function(cur){
                    cur.classList.toggle('red-focus');
                });

                document.querySelector(DOMStrings.inputBtn).classList.toggle('red');

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
    
    document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType)

    };

    var updateBudget = function() {

        // 1. calculate the budget
            budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on th ui
        UICtrl.displayBudget(budget);
    }

    var updatePercentages = function() {
        var percentages;
        // 1. calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        percentages = budgetCtrl.getPercentages();
        
        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    }
    
    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get the field input data

        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0)
        {
            // 2. Add the item to the budget controller and return it
            newItem = budgetCtrl.addItem(input.type,input.description,input.value);

            // 3. Add the item to the UI
            
            UICtrl.addListItem(newItem , input.type);

            // Clear the fields

            UICtrl.clearFields();

            //5. Calculate and update budget
            updateBudget(); 

            // 6. calculate and update percentages
            updatePercentages();
        }   
    };

    var ctrlDeleteItem = function(event) {
        var itemId,splitId,type,ID;
        
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemId){

             splitId = itemId.split('-');
             type = splitId[0];
            ID = parseInt(splitId[1]);
        }
        // 1. delete the item from the data structure
        budgetCtrl.deleteItem(type,ID);

        // 2. delete the item from the ui
        UICtrl.deleteListItem(itemId);

        // 3. update and show the new budget 
        updateBudget();

        // 4. calculate and update percentages
        updatePercentages();
       


    };

    return {
        init : function() {
            console.log('Application has statrted');
            setupEventListeners();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1  
            });
            UICtrl.displayMonth();
        }
    }
})(budgetController,UIController);


controller.init();