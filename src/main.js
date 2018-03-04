var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    // Count how many of each role of creep we have.
    // TODO: Make this more elegant and dynamic.
    var roles = ['harvester','builder','upgrader'], roleCounts = {};
    roles.sort();
    roles.forEach((role) => {
        roleCounts[role] = 0;
    });
    if(Game.creeps) {
        Object.keys(Game.creeps).forEach((creepName) => {
            var creep = Game.creeps[creepName];
            roleCounts[creep.memory.role] += 1;
        });
    }
    // Log out how many of each role of creep we have.
    console.log('Human time: ' + new Date().toString());
    console.log('Game.time: ' + Game.time);
    roles.forEach((role) => {
        console.log(role + ': ' + roleCounts[role]);
    });

    // Hack to spawn new creeps of our 3 roles if we have below a minimum threshold.
    // TODO: Move this to its own module.
    if (Game.spawns) {
        Object.keys(Game.spawns).forEach((spawnName) => {
            var spawn = Game.spawns[spawnName];

            // TODO: Check whether spawn.spawning is set, we may be able to omit this flag altogether.
            var spawnCommandSent = 0;

            // TODO: Automate this to scale to our capacity, making bigger creeps as we are able to.
            var requiredSpawnEnergy = 200;

            // TODO: Make these dynamic per role.
            if(spawn.energy >= requiredSpawnEnergy && !spawn.spawning && !spawnCommandSent && roleCounts['harvester'] < 2 ) {
                var newName = 'Harvester' + Game.time;
                console.log('Spawning new harvester: ' + newName);
                spawn.spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'harvester'}});
                spawnCommandSent = 1;
            }
            if(spawn.energy >= requiredSpawnEnergy && !spawn.spawning && !spawnCommandSent && roleCounts['upgrader'] < 5 ) {
                var newName = 'Upgrader' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                spawn.spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'upgrader'}});
                spawnCommandSent = 1;
            }
            if(spawn.energy >= requiredSpawnEnergy && !spawn.spawning && !spawnCommandSent && roleCounts['builder'] < 2 ) {
                var newName = 'Builder' + Game.time;
                console.log('Spawning new builder: ' + newName);
                spawn.spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'builder'}});
                spawnCommandSent = 1;
            }
            if(spawn.spawning) {
                var spawningCreep = Game.creeps[spawn.spawning.name];
                Game.spawns['Spawn1'].room.visual.text(
                    '🛠️' + spawningCreep.memory.role, spawn.pos.x + 1, spawn.pos.y, {align: 'left', opacity: 0.8}
                );
            }
        });
    }

    // var tower = Game.getObjectById('TOWER_ID');
    // if(tower) {
    //     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //         filter: (structure) => structure.hits < structure.hitsMax
    //     });
    //     if(closestDamagedStructure) {
    //         tower.repair(closestDamagedStructure);
    //     }

    //     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //     if(closestHostile) {
    //         tower.attack(closestHostile);
    //     }
    // }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        // TODO: Make this select the appropriate role code dynamically.
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }

    // Dump an empty line at the end so we can see a visible break between iterations.
    console.log()
}