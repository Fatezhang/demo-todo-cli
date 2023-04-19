#! /usr/bin/env node

import chalk from "chalk";
import { program } from "commander";

import Conf from 'conf'

const todoStore = new Conf({ projectName: 'demo-todos' })

const TODO_LIST_KEY = 'todos-list';

const list = () => {
  const todoList = todoStore.get(TODO_LIST_KEY)
  if (todoList && todoList.length) {
    console.log(
      chalk.blue('Tasks in green are done, in yellow are not done')
    )
    todoList.forEach(({ done, content }, index) => {
      if (done) {
        console.log(chalk.green(`${index}\t- ${content}\t[DONE]`))
      } else {
        console.log(chalk.yellowBright(`${index}\t- ${content}`))
      }
    })
  } else {
    console.log(chalk.red.bold('You don\'t have any todo task'))
  }
}

const add = (content) => {
  const todoTasks = todoStore.get(TODO_LIST_KEY) ?? [];

  todoTasks.push({
    done: false,
    content
  })
  todoStore.set(TODO_LIST_KEY, todoTasks)
  console.log(chalk.blue(`Added one task, the index for the latest task is ${todoTasks.length - 1}`))
}

const mark = ({ index }) => {
  let markedNum = 0;
  if (!index) {
    throw new Error('You must specify a task index')
  }
  const idx = Number(index)
  const todoTasks = todoStore.get(TODO_LIST_KEY) ?? [];
  const newTasks = todoTasks.map(({ done, content }, i) => {
    if (idx === i) {
      markedNum++;
    }
    return ({ done: idx === i, content })
  })
  todoStore.set(TODO_LIST_KEY, newTasks)
  console.log(chalk.blue(`Marked ${markedNum} task, the index for the task is ${index}`))
}

program
  .command('list')
  .description('List all todo tasks')
  .action(list)
program.command('add <task>')
  .description('Add a new task, the 1st param should be your text')
  .action(add)
program.command('mark')
  .description('Mark a task as done')
  .option('-i, --index <index>', 'Specify the task index to mark it as done, if not specify, no task will be marked')
  .action(mark)

program.parse()

