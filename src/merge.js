/**
 * Merge conversion results
 *
 * @param {ConvertResult} base - Result to merge into.
 * @param {ConvertResult} update - Changes to merge.
 */
function merge(base, update) {
  if (update.state) {
    mergeState(base.state, update.state);
  }
  if (update.options) {
    mergeOptions(base.options, update.options);
  }
  mergeSteppingStages(base, update);
  if (update.imports) {
    mergeImports(base.imports, update.imports);
  }
  if (update.vars) {
    mergeVariables(base, update);
  }
  if (update.constants) {
    mergeConstants(base, update);
  }
  if (update.files) {
    mergeFiles(base, update);
  }
  if (update.defaults) {
    base.defaults.push(...update.defaults);
  }
  if (update.cookies) {
    mergeCookies(base, update);
  }
  if (update.init) {
    // eslint-disable-next-line no-param-reassign
    base.init += update.init;
  }
  if (update.setup) {
    // eslint-disable-next-line no-param-reassign
    base.setup += update.setup;
  }
  if (update.prolog) {
    // eslint-disable-next-line no-param-reassign
    base.prolog += update.prolog;
  }
  if (update.users) {
    base.users.push(...update.users);
  }
  if (update.steppingUser) {
    // eslint-disable-next-line no-param-reassign
    base.steppingUser += update.steppingUser;
  }
  if (update.teardown) {
    // eslint-disable-next-line no-param-reassign
    base.teardown += update.teardown;
  }
  if ('logic' in update) {
    mergeLogic(base, update);
  }
}

function mergeState(base, update) {
  for (const value of update) {
    base.add(value);
  }
}

function mergeOptions(base, update) {
  for (const key of Object.keys(update)) {
    mergeOption(base, update, key);
  }
}

function mergeSteppingStages(base, update) {
  if (!(update.steppingStages && update.steppingStages.length)) {
    return;
  }
  if (base.steppingStages.length) {
    throw new Error('Multiple SteppingThreadGroups not supported');
  }
  base.steppingStages.push(...update.steppingStages);
}

function mergeOption(base, update, key) {
  switch (key) {
    case 'linger':
    case 'paused':
      if (key in base) {
        throw new Error(`Redefinition of option: ${key}`);
      }
      // eslint-disable-next-line no-param-reassign
      base[key] = update[key];
      break;
    case 'hosts':
      if (!base.hosts) {
        // eslint-disable-next-line no-param-reassign
        base.hosts = {};
      }
      Object.assign(base.hosts, update.hosts);
      break;
    case 'stages':
      if (!base.stages) {
        // eslint-disable-next-line no-param-reassign
        base.stages = [];
      }
      mergeStages(base.stages, update.stages);
      break;
    case 'noVUConnectionReuse':
      // eslint-disable-next-line no-param-reassign
      base.noVUConnectionReuse =
        base.noVUConnectionReuse || update.noVUConnectionReuse; // once true, always true
      break;
    default:
      throw new Error(`Unrecognized option: ${key}`);
  }
}

function mergeStages(base, update) {
  const last = lastTarget(base);
  for (const stage of update) {
    if (Array.isArray(stage)) {
      for (const substage of stage) {
        substage.target += last;
      }
    } else {
      stage.target += last;
    }
  }
  base.push(...update);
}

function lastTarget(stages) {
  if (!stages.length) {
    return 0;
  }
  const stage = stages[stages.length - 1];
  if (Array.isArray(stage)) {
    return stage[stage.length - 1].target;
  }
  return stage.target;
}

function mergeImports(base, update) {
  for (const [key, value] of update) {
    base.set(key, value);
  }
}

function mergeVariables(base, update) {
  for (const [key, spec] of update.vars) {
    mergeVariable(base, key, spec);
  }
}

function mergeVariable(base, key, spec) {
  // JMeter specifies redefinition valid, final definition has precedence
  base.vars.set(key, spec);
}

function mergeConstants(base, update) {
  for (const [key, value] of update.constants) {
    mergeConstant(base, key, value);
  }
}

function mergeFiles(base, update) {
  for (const [key, value] of update.files) {
    mergeFile(base.files, key, value);
  }
}

function mergeFile(base, key, value) {
  if (base.has(key) && base.get(key) !== value) {
    throw new Error(`Redefinition of file (${key}): ${value}`);
  }
  base.set(key, value);
}

function mergeConstant(base, key, value) {
  switch (key) {
    case 'headers':
      if (!base.constants.has(key)) {
        base.constants.set(key, new Map());
      }
      mergeHeaders(base.constants.get(key), value);
      break;
    default:
      throw new Error(`Unrecognized constant: ${key}`);
  }
}

function mergeHeaders(base, update) {
  for (const [key, value] of update) {
    if (base.has(key)) {
      throw new Error(`Redefinition of header: ${key}`);
    }
    base.set(key, value);
  }
}

function mergeCookies(base, update) {
  for (const [key, value] of update.cookies) {
    base.cookies.set(key, value);
  }
}

function mergeLogic(base, update) {
  if (update.user) {
    base.users.push(update.logic);
  } else {
    if (!('logic' in base)) {
      // eslint-disable-next-line no-param-reassign
      base.logic = '';
    }
    // eslint-disable-next-line no-param-reassign
    base.logic += update.logic;
  }
}

module.exports = merge;
