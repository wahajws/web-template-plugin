'use strict';
/**
 * Function to run SQL seed data on app startup
 * @param {string} filename - Path to SQL file
 */
const os = require("os");
const fs = require('fs');
const csv = require('csvtojson');
const path = require('path');
require('dotenv').config();

const importConfig = {

	autoseed: process.env.AUTO_SEED || 'false',

	// Delay before running seed data (in milliseconds)
	delay: 5000,
	
	// List of import files
	sqlTablePath: './config/setup/sql/tables/*.sql',	// create tables
	sqlViewPath: './config/setup/sql/views/*.sql',		// create views
	sqlDataPath: './config/setup/sql/data/*.sql', 		// insert sample data in sql format
	csvDataPath: './config/setup/csv/data/*.csv',      	// insert sample data in CSV format
    jsonDataPath: './config/setup/json/data/*.json',    // insert sample data in json format
	
	// Options for SQL execution
	sqlOptions: {
		dialect: process.env.DB_DIALECT || 'mysql'
	},
	
	// Logging options
	logging: {
		showPreview: true,          // Show SQL content preview
		previewLength: 200,         // Length of SQL preview
		showResults: true           // Show execution results
	},
};

function setEnvValue(key, value) {

    // read file from hdd & split if from a linebreak to a array
    const ENV_VARS = fs.readFileSync("./.env", "utf8").split(os.EOL);

    // find the env we want based on the key
    const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
        return line.match(new RegExp(key));
    }));

    // replace the key/value with the new value
    ENV_VARS.splice(target, 1, `${key}=${value}`);

    // write everything back to the file system
    fs.writeFileSync("./.env", ENV_VARS.join(os.EOL));

}

async function processSqlFile(sequelize, dirSqlFiles, sqlProcess) {
    var dirName = __dirname;
    if(dirSqlFiles.slice(-5) === '*.sql' ) {
        dirName = dirSqlFiles.substring(0, dirSqlFiles.indexOf('*.sql'))
    }
    
    console.log(`🌱 ${sqlProcess} from: ${dirName}`);
    
    // Import all sql files
    try {
        fs.readdirSync(dirName)
            .filter(file => {
                return (
                    file.indexOf('.') !== 0 &&
                    file.slice(-4) === '.sql'    
                );
            })
            .forEach(async file => {
                const sqlFileName = path.join(dirName, file);

                // Check if file exists
                if (!fs.existsSync(sqlFileName)) {
                    console.log(`⚠️ ${sqlProcess} file not found: ${sqlFileName} - Skipping ${sqlProcess}...`);
                    return;
                }

                // Read SQL file using promises
                const data = await fs.promises.readFile(sqlFileName, "utf8");
            
                try {
                    if (importConfig.logging.showPreview) {
                        console.log("📄 SQL Content Preview:", data.toString().substring(0, importConfig.logging.previewLength) + "...");
                    }
                    
                    // Split SQL into individual statements and execute them one by one
                    const sqlStatements = data.toString()
                        .split(';')
                        .map(stmt => stmt.trim())
                        .filter(stmt => {
                            // Remove empty statements and pure comment lines
                            if (stmt.length === 0) return false;
                            
                            // Remove lines that are only comments
                            const lines = stmt.split('\n');
                            const nonCommentLines = lines.filter(line => {
                                const trimmed = line.trim();
                                return trimmed.length > 0 && !trimmed.startsWith('--');
                            });
                            
                            return nonCommentLines.length > 0;
                        });
                    
                    // Execute each statement individually
                    for (let i = 0; i < sqlStatements.length; i++) {
                        const statement = sqlStatements[i];
                        if (statement.trim()) {
                            try {
                                // console.log(`🔄 Executing statement ${i + 1}/${sqlStatements.length}`);
                                const result = await sequelize.query(statement, {
                                    type: sequelize.QueryTypes.RAW
                                });
                                
                                if (importConfig.logging.showResults && result) {
                                    console.log(`✅ Statement ${i + 1} executed successfully`);
                                }
                            } catch (stmtError) {
                                console.error(`❌ Error in statement ${i + 1}:`, stmtError.message);
                                console.log(`📄 Problematic statement: ${statement.substring(0, 100)}...`);
                                
                                // Continue with other statements even if one fails
                                continue;
                            }
                        }
                    }
                    
                    console.log(`✅ ${sqlProcess} execution completed!`);

                } catch (e) {
                    console.error("❌ Query error:", e.message);
                    
                    // Check if it's a object doesn't exist error
                    if (e.message.includes("doesn't exist") || e.message.includes("Unknown SQL Object")) {
                        console.log("💡 Tip: Some SQL objects don't exist yet. This is normal if you haven't run database migrations.");
                        console.log("💡 You can create additional SQL objects to match your existing schema.");
                    }
                    
                    // Check if it's a syntax error
                    if (e.message.includes("syntax")) {
                        console.log("💡 Tip: There might be a SQL syntax error. Check your SQL file for typos.");
                    }
                    
                    // Don't throw the error, just log it and continue
                    console.log("⚠️ Continuing with other sql files...");
                }
            });    
    } catch (err) {
        // Handle specific error codes
        if (err.code === 'ENOENT') {
            console.error('Directory does not exist');
        } else if (err.code === 'EACCES') {
            console.error('Permission denied');
        } else {
            console.error('An unexpected error occurred:', err.message);
        }
    }
}

async function processCsvFiles(sequelize, dirCsvFiles) {
    var dirName = __dirname;
    if(dirCsvFiles.slice(-5) === '*.csv' ) {
        dirName = dirCsvFiles.substring(0, dirCsvFiles.indexOf('*.csv'))
    }

    console.log(`🌱 Running seed data from CSV files in: ${dirName}`);

    // Import all model files
    try {
        fs.readdirSync(dirName)
            .filter(file => {
                return (
                    file.indexOf('.') !== 0 &&
                    file.slice(-4) === '.csv'    
                );
            })
            .forEach(async file => {
                const csvFilePath = path.join(dirName, file);
                const modelName = file.substring(0, file.indexOf('.csv'));
                var modelData = await csv().fromFile(csvFilePath);
                const modelToUpdate = sequelize.models[modelName];

                // Read each row from CSV file and remove null fields
                for(const dataItem of modelData){
                    var newDataItem = {};
                    for (const key in dataItem) {
                        // console.log(`${key}: ${dataItem[key]}`);
                        if(dataItem[key] !== 'NULL'){
                            newDataItem[key] = dataItem[key];
                        }
                    }

                    await modelToUpdate.create(newDataItem); 
                }
            });    
        console.log(`✅ CSV data import completed!`);
    } catch (err) {
        // Handle specific error codes
        if (err.code === 'ENOENT') {
            console.error('Directory does not exist');
        } else if (err.code === 'EACCES') {
            console.error('Permission denied');
        } else {
            console.error('An unexpected error occurred:', err.message);
        }
    }
}

async function processJsonFiles(sequelize, dirJsonFiles) {
    var dirName = __dirname;
    if(dirJsonFiles.slice(-6) === '*.json' ) {
        dirName = dirJsonFiles.substring(0, dirJsonFiles.indexOf('*.json'))
    }

    console.log(`🌱 Running seed data from JSON files in: ${dirName}`);

    // Import all model files
    try {
        fs.readdirSync(dirName)
            .filter(file => {
                return (
                    file.indexOf('.') !== 0 &&
                    file.slice(-5) === '.json'    
                );
            })
            .forEach(async file => {
                const modelToUpdate = sequelize.models['Settings'];
                const jsonFilePath = path.join(dirName, file);
                const arrayName = file.substring(0, file.indexOf('.json'));

                const jsonData = fs.readFileSync(jsonFilePath);

                // console.log("Array Name, Value: ", arrayName, JSON.parse(jsonData));
                var newDataItem = {
                    settingKey: arrayName,
                    settingValue: jsonData
                }

                await modelToUpdate.create(newDataItem); 
            });    
        console.log(`✅ JSON data import completed!`);
    } catch (err) {
        // Handle specific error codes
        if (err.code === 'ENOENT') {
            console.error('Directory does not exist');
        } else if (err.code === 'EACCES') {
            console.error('Permission denied');
        } else {
            console.error('An unexpected error occurred:', err.message);
        }
    }
}

module.exports = {
    // Function to run seed data
    beginImport: async function(sequelize) {

        // Run seed data after MySQL initialization is required
        if (importConfig.autoseed) {
            console.log('🌱 Seed data execution enabled');

            // Run each seed SQL file sequentially
            await processSqlFile(sequelize, importConfig.sqlTablePath, "Creating SQL Tables").then(
                await processSqlFile(sequelize, importConfig.sqlViewPath, "Creating SQL Views").then(
                  await processSqlFile(sequelize, importConfig.sqlDataPath, "Importing SQL Table Data").then(

                    // Run each seed CSV file
                    await processCsvFiles(sequelize, importConfig.csvDataPath).then(

                        // Run each seed json file
                        await processJsonFiles(sequelize, importConfig.jsonDataPath)
                    )
                  )  
                )
            ).then(
                // Disable auto-seed after first run
                setEnvValue("AUTO_SEED", "false")  
            );

        } else {
            console.log('⏭️ Seed data execution disabled');
        }
    }
}
