

function createReflection(user, content){
	req = new XMLHttpRequest();
	req.open('POST', '/api/reflections');
	req.setRequestHeader('content-type', 'application/json');
	req.send(JSON.stringify({ user, content }));
}

createReflection('5948209783f6c85bc9d54950', 'Another lovely day');