export default {
	cellEdit: function (action) {
		action.component.setValueProcessData(action.data.oldValue);
		action.component.cellRendered();
	},

	rowAdd: function (action) {
		action.component.deleteActual();
	},

	rowDelete: function (action) {
		var newRow = this.table.rowManager.addRowActual(
			action.data.data,
			action.data.pos,
			action.data.index
		);

		if (this.table.options.groupBy && this.table.modExists("groupRows")) {
			this.table.modules.groupRows.updateGroupRows(true);
		}
		if (this.table.rowManager.getDisplayRows().length) {
			this.table.rowManager._clearPlaceholder();
		}
		this._rebindRow(action.component, newRow);
	},

	rowMove: function (action) {
		var after = action.data.posFrom - action.data.posTo > 0;

		this.table.rowManager.moveRowActual(
			action.component,
			this.table.rowManager.getRowFromPosition(action.data.posFrom),
			after
		);

		this.table.rowManager.regenerateRowPositions();
		this.table.rowManager.reRenderInPosition();
	},
};
