let url = 'http://localhost:8080/project1/';

document.getElementById('financeM').style.display='none';
document.getElementById('employee').style.display='none';
document.getElementById('logoutbtn').style.display='none';


document.getElementById("loginbtn").addEventListener("click", loginFunc);
document.getElementById("logoutbtn").addEventListener("click", logoutFunc);
document.getElementById('filterStatusBtn').addEventListener("click", queryReimb);
document.getElementById('SelectBtn').addEventListener("click", selectReimb);

// document.getElementById('UpdateBtn').addEventListener("click", updateReimb);

async function updateReimb() {
    let stat = document.getElementById('updateReimb').value;
    let reimbID = document.getElementById("reimbID").value;
    if (document.getElementById('link').innerHTML===reimbID&&document.getElementsByTagName('td').length!==1) {
        console.log('updating reimb to '+ stat + 'with id of: ' +reimbID);
        //call get
        let reimb = getReimb();
        let user = getUser();
        console.log(reimb);
        // not sure if i need to add whole object in patch 
        // but that is what i am doing
        // do post here
        let data = {
            reimbID: reimb.reimbID,
            reimbAmount: reimb.reimbAmount,
            reimbStatus: stat,
            reimbDescription: reimb.reimbDescription,
            reimbType: reimbType,
            reimbStatus: reimb.reimbStatus,
            reimbType: reimb.reimbType,
            reimbTimeResolved: reimb.timeResolved,
            reimbTimeSubmitted: reimb.timeSubmitted,
            author: user,
            resolver: resolver
        }

        let resp = await fetch("reimbursement/"+reimbID+'/', {
            method: 'PATCH',
            body: JSON.stringify(data),
            credentials : "include"
        })

        if (resp.status===200){
            document.getElementById("login-row").innerText = "Status is updated.";
        } else {
            document.getElementById("login-row").innerText = "That did not update";
        }
        reimbID="";
        stat="";

    }
}

// async function getUser() {

// }

async function getReimb() {

    let reimbID = document.getElementById("reimbID").value;
    console.log("you've picked this reimb id "+ reimbID);

    let response = await fetch(url+"reimbursement/"+reimbID+'/');

    if (response.status === 200) {
        console.log('getting');
        let data = await response.json();
        console.log(data);
        return data;
    } else {
        console.log('you are not able to get that reimb');
    }
}
async function loginFunc() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    //
    console.log(username);
    let user = {
        username : username,
        password : password
    }

    let resp = await fetch(url+"login", {
        method: 'POST',
        body: JSON.stringify(user),
        credentials : "include"
    })

    if (resp.status===200){
        document.getElementById("login-row").innerText = "YOU HAVE LOGGED IN "+user.username;
        if (user.username==='captini'|| user.username==='captain' ||user.username==='liz') {
            document.getElementById('financeM').style.display='block';
        } else {
            document.getElementById('employee').style.display='block';
        }
        findAllFunc();
        document.getElementById('logoutbtn').style.display = "block";
        document.getElementById('logininput').style.display='none'
        document.getElementById("username").value="";
        document.getElementById("password").value="";


    } else {
        document.getElementById("login-row").innerText = "Login failed!";
    }
}

async function logoutFunc() {
    let resp = await fetch(url+"logout", {
        method: 'GET',
        credentials : "include"
    })
    if (resp.status===200){
        document.getElementById("login-row").innerText = "YOU HAVE LOGGED out";  
        document.getElementById('financeM').style.display='none';
        document.getElementById('employee').style.display='none';
        document.getElementById('logoutbtn').style.display='none';
        document.getElementById('reimb-body').innerHTML="";
        document.getElementById('logininput').style.display='block';
    } else {
        document.getElementById("login-row").innerText = "Logout somehow failed!";
    }
}

async function selectReimb() {

    let reimbID = document.getElementById("reimbID").value;
    console.log("you've picked this reimb id "+ reimbID);
    // document.getElementById('select').innerHTML = '';

    let response = await fetch(url+"reimbursement/"+reimbID+'/');

    if (response.status === 200) {
        let data = await response.json();
        console.log('data: '+data);
        let tbody = document.getElementById('reimb-body');
        tbody.innerHTML= "";
        let newRow = document.createElement('tr');
        let td1 = document.createElement('td');
        td1.id = "link"
        td1.innerText = data.reimbID; 
        td1.style.color = 'blue';
        
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let td5 = document.createElement('td');
        let td6 = document.createElement('td');
        let td7 = document.createElement('td');

        td2.innerText = data.reimbAmount;
        if (data.timeSubmitted===null) {
            td3.innerText = "not updated"
        } else {
            td3.innerText = data.timeSubmitted.hour+"."+data.timeSubmitted.minute+"."+data.timeSubmitted.second;
        }
        if (data.timeResolved===null) {
            td4.innerText = "not updated"
        } else {
            td4.innerText = data.timeResolved.hour+"."+data.timeResolved.minute+"."+data.timeResolved.second;
        }
        td5.innerText = data.reimbDescription;
        td6.innerText = data.reimbType.reimbType
        td7.innerText = data.reimbStatus.reimbStatus;

        newRow.appendChild(td1);
        newRow.appendChild(td2);
        newRow.appendChild(td3);
        newRow.appendChild(td4);
        newRow.appendChild(td5);
        newRow.appendChild(td6);
        newRow.appendChild(td7);

        tbody.appendChild(newRow);
    } else {
        console.log('that did not work');
    }
    // reimbID = document.getElementById("reimbID").value='';
}

async function queryReimb() {
    let query = document.getElementById("filterID").value;
    console.log(query);
    // document.getElementById('select').innerHTML = '';

    const myHeaders = new Headers();
    myHeaders.append("Origin", "corssucklol");
    let resp = await fetch(url+"reimbursement", {
        credentials: 'include',
        headers: {
            Origin: "corssucks"
        }
      });

    if(resp.status===200){
        let data = await resp.json();
        console.log(data);
        let tbody = document.getElementById('reimb-body');
        tbody.innerHTML= "";
        for (let i = 0; i < data.length; i++) {
            if (query===data[i].reimbStatus.reimbStatus) {
                console.log(data);

                let tbody = document.getElementById('reimb-body');
                console.log(data[i]);
                console.log("amount: "+data[i].reimbAmount);
                let newRow = document.createElement('tr');
                let td1 = document.createElement('td');
                td1.id = "link" 
                td1.innerText = data[i].reimbID; 
                td1.style.color = 'blue';
            
                let td2 = document.createElement('td');
                let td3 = document.createElement('td');
                let td4 = document.createElement('td');
                let td5 = document.createElement('td');
                let td6 = document.createElement('td');
                let td7 = document.createElement('td');

                td2.innerText = data[i].reimbAmount;
                if (data[i].timeSubmitted===null) {
                    td3.innerText = "not updated"
                } else {
                    td3.innerText = data[i].timeSubmitted.hour+"."+data[i].timeSubmitted.minute+"."+data[i].timeSubmitted.second;
                }
                if (data[i].timeResolved===null) {
                    td4.innerText = "not updated"
                } else {
                    td4.innerText = data[i].timeResolved.hour+"."+data[i].timeResolved.minute+"."+data[i].timeResolved.second;
                }
                td5.innerText = data[i].reimbDescription;
                td6.innerText = data[i].reimbType.reimbType
                td7.innerText = data[i].reimbStatus.reimbStatus;

                newRow.appendChild(td1);
                newRow.appendChild(td2);
                newRow.appendChild(td3);
                newRow.appendChild(td4);
                newRow.appendChild(td5);
                newRow.appendChild(td6);
                newRow.appendChild(td7);

                tbody.appendChild(newRow);
                }
          }
    }
    query = document.getElementById("filterID").value='';


}

async function findAllFunc() {
        const myHeaders = new Headers();
        myHeaders.append("Origin", "corssucklol");
        let resp = await fetch(url+"reimbursement", {
        credentials: 'include',
        headers: {
            Origin: "corssucks"
        }
      });
        if(resp.status===200){
            let data = await resp.json();
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                let tbody = document.getElementById('reimb-body');
                console.log(data[i]);
                console.log("amount: "+data[i].reimbAmount);
                let newRow = document.createElement('tr');
                let td1 = document.createElement('td');
                td1.id = "link" 
                td1.innerText = data[i].reimbID; 
                td1.style.color = 'blue';
            
                let td2 = document.createElement('td');
                let td3 = document.createElement('td');
                let td4 = document.createElement('td');
                let td5 = document.createElement('td');
                let td6 = document.createElement('td');
                let td7 = document.createElement('td');

                td2.innerText = data[i].reimbAmount;
                if (data[i].timeSubmitted===null) {
                    td3.innerText = "not updated"
                } else {
                    td3.innerText = data[i].timeSubmitted.hour+"."+data[i].timeSubmitted.minute+"."+data[i].timeSubmitted.second;
                }
                if (data[i].timeResolved===null) {
                    td4.innerText = "not updated"
                } else {
                    td4.innerText = data[i].timeResolved.hour+"."+data[i].timeResolved.minute+"."+data[i].timeResolved.second;
                }
                td5.innerText = data[i].reimbDescription;
                td6.innerText = data[i].reimbType.reimbType
                td7.innerText = data[i].reimbStatus.reimbStatus;

                newRow.appendChild(td1);
                newRow.appendChild(td2);
                newRow.appendChild(td3);
                newRow.appendChild(td4);
                newRow.appendChild(td5);
                newRow.appendChild(td6);
                newRow.appendChild(td7);

                tbody.appendChild(newRow);
            }
    }
}