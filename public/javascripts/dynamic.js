
	$(document).ready(function(){

		var iCnt = 0;

		    var container = $(document.createElement('div')).css({padding: '5px', margin: '20px', width: '50%'});

		     $(container).append('<input type=text class="input" id=tb' + iCnt + ' ' +'placeholder="Target URL" /><br><br>');

		     	iCnt = iCnt + 1;

                if (iCnt == 1) {        // SHOW SUBMIT BUTTON IF ATLEAST "1" ELEMENT HAS BEEN CREATED.
                    var divSubmit = $(document.createElement('div'));
                    $(divSubmit).append('<input type=button class="bt" id=btSubmit value=Submit style="margin-left:2%" />');
                }
                $('#main').after(container, divSubmit);   // ADD BOTH THE DIV ELEMENTS TO THE "main" CONTAINER.


		
		    $('#btAdd').click(function() {
            if (iCnt <= 19) {
                iCnt = iCnt + 1;
                // ADD TEXTBOX.
                $(container).append('<input type=text class="input" id=tb' + iCnt + ' ' +'placeholder="Target URL" /><br><br>');

                $('#main').after(container, divSubmit);   // ADD BOTH THE DIV ELEMENTS TO THE "main" CONTAINER.
            }
            else {      // AFTER REACHING THE SPECIFIED LIMIT, DISABLE THE "ADD" BUTTON. (20 IS THE LIMIT WE HAVE SET)
                $(container).append('<label>Reached the limit</label>'); 
                $('#btAdd').attr('class', 'bt-disable'); 
                $('#btAdd').attr('disabled', 'disabled');
            }
        });

		    $('#btSubmit').on('click', addLoadBalancerConfig);
		   $('#btnStartBalancer').on('click', startLoadBalancing);

	});//doc.ready


function startLoadBalancing(event)
{

	event.preventDefault();

	alert("in startLoadBalancing" + data);

	$.ajax({
			type: "POST",
			data: data,
			url: 'http://54.183.158.108:8006/proxyserver/createloadbalancer',
			dataType: JSON 

	}).done(function(response){
		alert(response.msg);
	});
}


var data;

function addLoadBalancerConfig(event)
{
	event.preventDefault();

	var values = [];

	alert('getting values');
	$('.input').each(function(){
		values.push(this.value);
	});

	data = {'targets': values}

	$.ajax({
			type: 'POST',
			data: data,
			url: '/api/users/U-0/loadbalancer',
			dataType: JSON
	}).done(function(response){

		alert("Saved..."+response.msg);

	});

	//startLoadBalancing(data);


}
