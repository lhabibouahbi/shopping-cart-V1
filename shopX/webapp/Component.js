sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/model/json/JSONModel',
	'sap/f/FlexibleColumnLayoutSemanticHelper',
	'sap/f/library'
], function(UIComponent, JSONModel, FlexibleColumnLayoutSemanticHelper, fioriLibrary) {
	'use strict';

	return UIComponent.extend('sap.ui.demo.fiori2.Component', {

		metadata: {
			manifest: 'json'
		},

		init : function () {
			// call the init function of the parent
			var oModel,
				oProductsModel,
				oRouter;

			UIComponent.prototype.init.apply(this, arguments);

			oModel = new JSONModel();
			this.setModel(oModel);
			
			// set data model
			var oModel = new JSONModel("./model/products.json");
			oModel.setSizeLimit(1000);
			oModel.setDefaultBindingMode("OneWay");
			this.setModel(oModel, "products");

			oRouter = this.getRouter();
			oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
			oRouter.initialize();
		 },

		 getHelper: function () {
			return this._getFcl().then(function(oFCL) {
				var oSettings = {
					defaultTwoColumnLayoutType: fioriLibrary.LayoutType.TwoColumnsMidExpanded,
					defaultThreeColumnLayoutType: fioriLibrary.LayoutType.ThreeColumnsMidExpanded
				};
				return (FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings));
			});
		},

		 _onBeforeRouteMatched: function(oEvent) {
			var oModel = this.getModel(),
				sLayout = oEvent.getParameters().arguments.layout,
				oNextUIState;

			// If there is no layout parameter, set a default layout (normally OneColumn)
			if (!sLayout) {
				this.getHelper().then(function(oHelper) {
					oNextUIState = oHelper.getNextUIState(0);
					oModel.setProperty("/layout", oNextUIState.layout);
				});
				return;
			}

			oModel.setProperty("/layout", sLayout);
		},

		_getFcl: function () {
			return new Promise(function(resolve, reject) {
				var oFCL = this.getRootControl().byId('flexibleColumnLayout');
				if (!oFCL) {
					this.getRootControl().attachAfterInit(function(oEvent) {
						resolve(oEvent.getSource().byId('flexibleColumnLayout'));
					}, this);
					return;
				}
				resolve(oFCL);

			}.bind(this));
		}

	});
});