// Copyright (c) 2023, Nigel Jena and contributors
// For license information, please see license.txt

frappe.ui.form.on('Bidvest Settings', {
	refresh: function(frm) {
		frm.disable_save();
		frm.set_query('paid_to', () => {
			return {
				filters: {
					account_type: 'Bank',
					root_type: 'Asset',
					report_type: 'Balance Sheet',
					account_currency: 'ZAR',
					company: frm.doc.company
				}
			}
		});
		frm.set_query('debit_to', () => {
			return {
				filters: {
					account_type: 'Receivable',
					root_type: 'Asset',
					report_type: 'Balance Sheet',
					account_currency: 'ZAR',
					company: frm.doc.company
				}
			}
		});
		frm.set_query('expense_account', () => {
			return {
				filters: {
					account_type: 'Expense Account',
					root_type: 'Expense',
					report_type: 'Profit and Loss',
					account_currency: 'ZAR',
					company: frm.doc.company
				}
			}
		});
		frm.set_query('income_account', () => {
			return {
				filters: {
					account_type: 'Income Account',
					root_type: 'Income',
					report_type: 'Profit and Loss',
					account_currency: 'ZAR',
					company: frm.doc.company
				}
			}
		});
		frm.set_query('mode_of_payment', () => {
			return {
				filters: {
					type: 'Bank',
				}
			}
		});
		frm.set_query('price_list', () => {
			return {
				filters: {
					selling: 1,
				}
			}
		});
		frm.set_query('cost_center', () => {
			return {
				filters: {
					is_group: 0,
					disabled: 0,
				}
			}
		});
	}
});

frappe.ui.form.on('Bidvest Settings', 'test_connection', function(){
	// cur_frm.doc.test_connection.read_only=1;
	cur_frm.set_df_property('test_connection','read_only', 1);
	cur_frm.set_df_property('test_connection','label','Testing, Please Wait...');
	frappe.call({
		method:'payment_gateway_bidvest.payment_gateway_bidvest.doctype.bidvest_settings.bidvest_settings.test_connection',
		args: { data:{
			storename: cur_frm.doc.storename,
			passphrase: cur_frm.doc.passphrase,
			environment: cur_frm.doc.environment,
			return_url: cur_frm.doc.return_url,
			cancel_url: cur_frm.doc.cancel_url
		}},
		callback: (r) => {
			console.log(r)
			// cur_frm.doc.test_connection.read_only=0;
			cur_frm.set_df_property('test_connection','label','Test Connection');
			cur_frm.set_df_property('test_connection','read_only', 0);
			if (r.message.status_code==200){
				frappe.msgprint({
					title: __('Test Connection Success'),
					indicator: 'green',
					message: __(r.message.message),
				})
				cur_frm.enable_save();
			}
			else {
				frappe.msgprint({
					title: __('Test Connection Error'),
					indicator: 'red',
					message: __(r.message.message),
				})
			}
			
		},
		error: (r) => {
			frappe.throw(r.message.message)
		}
	});
	// cur_frm.doc.test_connection.read_only=0;
});
