module.exports = {
  FootprintController: {
    create: [ 'FootprintPolicy.create' ],
    find: [ 'FootprintPolicy.find' ],
    findOne: [ 'FootprintPolicy.findOne' ],
    update: [ 'FootprintPolicy.update' ],
    destroy: [ 'FootprintPolicy.destroy' ],
    createAssociation: [ 'FootprintPolicy.createAssociation' ],
    findAssociation: [ 'FootprintPolicy.findAssociation' ],
    findOneAssociation: [ 'FootprintPolicy.findOneAssociation' ],
    updateAssociation: [ 'FootprintPolicy.updateAssociation' ],
    destroyAssociation: [ 'FootprintPolicy.destroyAssociation' ]
  }
}
