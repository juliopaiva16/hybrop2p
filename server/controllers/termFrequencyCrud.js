// termFrequencyCrud.js
const TermFrequency = require('../models/TermFrequency');

TermFrequencyCrud = {};

TermFrequencyCrud.createTermFrequency = async function (term, frequency) {
  return TermFrequency.create({ term, frequency });
}

TermFrequencyCrud.getOrCreateTermFrequency = async function (term) {
  let termFrequency = await TermFrequencyCrud.getTermFrequencyByTerm(term);
  if (!termFrequency) {
    termFrequency = await TermFrequencyCrud.createTermFrequency(term, 0);
  }
  return termFrequency;
}

TermFrequencyCrud.getTermFrequencyById = async function (id) {
  return TermFrequency.findByPk(id);
}

TermFrequencyCrud.getTermFrequencyByTerm = async function (term) {
  return TermFrequency.findOne({ where: { term: term } });
}

TermFrequencyCrud.getAllTermFrequencies = async function () {
  return TermFrequency.findAll();
}

TermFrequencyCrud.updateTermFrequency = async function (id, term, frequency) {
  const termFrequency = await TermFrequency.findByPk(id);
  if (termFrequency) {
    termFrequency.term = term;
    termFrequency.frequency = frequency;
    return termFrequency.save();
  }
  return null;
}

TermFrequencyCrud.updateTermFrequencyByDelta = async function (id, delta) {
  const termFrequency = await TermFrequency.findByPk(id);
  if (termFrequency) {
    termFrequency.frequency += delta;
    return termFrequency.save();
  }
  return null;
}

TermFrequencyCrud.deleteTermFrequency = async function (id) {
  const termFrequency = await TermFrequency.findByPk(id);
  if (termFrequency) {
    return termFrequency.destroy();
  }
  return null;
}

module.exports = TermFrequencyCrud;
