       function start(){
            var body = document.getElementsByTagName("body")[0]; 
            var table = document.createElement('table'); //creating a table element here followed by tbody
            var tbody = document.createElement('tbody');
            var cnt = 1;   //Using the count variable for couting and assigning value to cells when looping through row and column arrays
            for(var i =1; i<=10;i++){   //looping through row array
                var trow = document.createElement('tr');    //creating a row element here
                    for(var j=1;j<=10;j++){                 //looping through column array and creating td element below
                        var tcol = document.createElement('td');
                        tcol.innerHTML = cnt;               //assigning the counter value to the celltext of columns
                        tcol.addEventListener('click',function mulValues(){ //adding a click event feature to each cell in table
                            var arr = [];                   //when a cell is clicked the mutiples of the value in that particular cell are retrieved and push them into an array
                            for(var k = 1;k <= 100;k++){    //loop to findout the mutiples of the selected cell value
                                if(k % this.innerHTML == 0){
                                    arr.push(k);            //pushing the multiples into an array
                                }
                            }
                            var x= document.getElementsByTagName('td'); //Now for comparing these multiple values to the cell values
                            for(var k = 0; k < 100; k ++){      //Used each td element cell value by looping through for compaing with
                                for(var n = 0;n<arr.length;n++){    //the array we created above so that we will have final values
                                    if(x[k].innerHTML == arr[n])    //after the comparison of two values 
                                    {
                                        x[k].innerHTML = "*";       //to push the '*' to the cell value of that particular col cell.
                                    }
                                }
                            } 
                        });
                        cnt += 1;               //icreasing the counter varialble value for assigning values till 100 in a 10x10 table
                        trow.appendChild(tcol);           ///appending columns to the rows         
                    }
                tbody.appendChild(trow);                //appending rows to the body
            }
            table.appendChild(tbody);                   //appending table body to the table
            body.appendChild(table);
            table.setAttribute("border",2);
            table.setAttribute("align",'center');
        }

        function resetFun(){
            window.location.reload()        //reloads the window page.
            }