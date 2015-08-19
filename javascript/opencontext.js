/*
 * ------------------------------------------------------------------
	AJAX for using the Open Context API
 * ------------------------------------------------------------------
*/


function OpenContextAPI() {
	/* Object for composing search entities */
	this.name = "opencontext"; //object name, used for DOM-ID prefixes and object labeling
	this.api_url = false;
	this.data = false;
	this.facets_dom_id = 'facets';
	this.map_dom_id = 'map';
	this.get_data = function() {
		// calls the Open Context API to get data
		var url = this.api_url;
		if (url != false) {
			return $.ajax({
				type: "GET",
				url: url,
				dataType: "json",
				headers: {          
					Accept : "application/json; charset=utf-8"
				},
				context: this,
				success: this.get_dataDone,
				error: this.get_dataError
			});
		}
	}
	this.get_dataDone = function(data){
		// function to display results of a request for data
		this.data = data;
		console.log(data);
		this.show_facets();
	}
	this.show_facets = function(){
		var act_dom = this.get_facets_dom();
		if (act_dom != false) {
			var html = '';
			var data = this.data;
			if ('totalResults' in data) {
				// show the total number of records found
				html += 'Open Context Records: <span class="badge">' + data['totalResults'] + '</span>'
			}
			if ('oc-api:has-facets' in data) {
				// show some search facets
				for (var i = 0, length = data['oc-api:has-facets'].length; i < length; i++) {
					var facet = data['oc-api:has-facets'][i];
					var facet_html = '<div class="panel panel-default">'
					facet_html += '<div class="panel-body">';
					facet_html += '<h4>' + facet.label + '</h4>'
					facet_html += this.make_facet_values_html(facet);
					facet_html += '</div>';
					facet_html += '</div>';
					html += facet_html;
				}
			}
			act_dom.innerHTML = html;
		}
	}
	this.make_facet_values_html = function(facet){
		var value_list = [];
		var html_list = [];
		if ('oc-api:has-id-options' in facet) {
			var value_list = facet['oc-api:has-id-options'];
		}
		else{
			var value_list = [];
		}
		for (var i = 0, length = value_list.length; i < length; i++) {
			var val_item = value_list[i];
			var val_html = val_item.label + '( + val_item.label + )';
			html_list.push(val_html);
		}
		var html = html_list.join(', ');
		return html;
	}
	this.get_dataError = function(){
		var act_dom = this.get_facets_dom();
		if (act_dom != false) {
			var html = [
			'<div class="alert alert-warning" role="alert">',
			'<span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span>',
			'Failed to load valid data from Open Context.',
			'</div>'
			].join(' ');
			act_dom.innerHTML = html;
		}
	}
	this.get_facets_dom = function(){
		var act_dom = false;
		if (this.facets_dom_id != false) {
			if (document.getElementById(this.facets_dom_id)) {
				act_dom = document.getElementById(this.facets_dom_id);
			}
		}
		return act_dom;
	}
	
}
