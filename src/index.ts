#!/usr/bin/env node

import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import simpleGit from "simple-git";
import chalk from "chalk";
import options from "./data/options.json" assert { type: "json" };

const getDetails = async () => {
	const type = await inquirer.prompt({
		name: "type",
		type: "list",
		// prettier-ignore
		message: `Please ${chalk.underline("select the type")} of your commit •`,
		choices: () => {
			const opts = Object.entries(options.types);
			const pad = opts
				.map(ele => ele[0].length)
				.reduce((p, n) => Math.max(p, n));
			return opts.map(ele => ({
				name: `${ele[0].padEnd(pad)} — ${ele[1].emoji} ${
					ele[1].description
				}`,
				value: `${ele[1].emoji} ${ele[0]}`,
			}));
		},
	});

	const scope = await inquirer.prompt({
		name: "scope",
		type: "input",
		message: `Please enter a commit scope, if none, press ↳ Enter to continue •`,
	});

	const imp = await inquirer.prompt({
		name: "important",
		type: "confirm",
		message: "Is this commit important or breaking? [ Default: No ] •",
		default: false,
	});

	const message = await inquirer.prompt({
		name: "message",
		type: "input",
		message: "Please enter a commit message •",
	});

	return [type.type, scope.scope, imp.important, message.message];
};

const main = async () => {
	console.clear();
	console.log();
	const details = await getDetails();
	const spinner = createSpinner("Saving your commit...").start();
	await simpleGit().commit(details);
	spinner.success();
};

main();
