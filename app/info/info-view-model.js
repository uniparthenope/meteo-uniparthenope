var observableModule = require("data/observable");

function InfoViewModel() {
    var infoModel = observableModule.fromObject({
    });

    return infoModel;
}

module.exports = InfoViewModel;