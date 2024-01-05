function solveSudoku(population, grids, pop_size, elite_ratio, random_ratio, mutation_chance) {
    // this.fitnessFunction_string(gene);
    let curr_population = population;
    let next_population = [];
    let indexes_of_fixed_nums = this.getFixedIndexes(grids);
    let num_of_elite_genes = Math.floor(pop_size*elite_ratio);
    let num_of_random_genes = Math.floor(pop_size*random_ratio);

    //Sort the population in desc order of fitness
    curr_population = this.orderInDescFitness(curr_population);

    //Elite Gene transfer
    //Based on param
    for(let i = 0; i < num_of_elite_genes; i++){next_population.push(curr_population[i]);}

    //Random Gene Generation
    //Based on param
    for(let i = 0; i < num_of_random_genes; i++){
        let random_gene = this.getRandomGeneValue(grids);
        let temp_fitness = this.fitnessFunction_list(random_gene);
        next_population.push({gene: random_gene, fitness: temp_fitness});
    }
    
    //Mutate Genes
    let sum_of_fitnesses = this.getFitnessSum(curr_population);
    while(next_population.length < pop_size){
        // Select 2 parents genes
        let parent1 = this.rouletteWheelSelection(population, sum_of_fitnesses);
        let parent2 = this.rouletteWheelSelection(population, sum_of_fitnesses);

        // Perform crossover to create 2 children genes
        let child1 = this.crossOver(parent1, parent2, indexes_of_fixed_nums);
        let child2 = this.crossOver(parent1, parent2, indexes_of_fixed_nums);
        
        // Perform mutation of children
        child1 = this.mutateIndividual(child1, indexes_of_fixed_nums, mutation_chance);
        child2 = this.mutateIndividual(child2, indexes_of_fixed_nums, mutation_chance);
        
        // One parent survives to the next generation. Mutation might apply
        let mutated_parent = this.mutateIndividual(parent1, indexes_of_fixed_nums, mutation_chance);

        // Add products to next population
        next_population.push(child1);
        if(next_population.length != pop_size){next_population.push(child2);}
        if(next_population.length != pop_size){next_population.push(mutated_parent);}
    }

    return next_population;
}


function revertChangesToFixedNums(parent, child, indexes_of_fixed_nums){
    let reverted_child = child;
    for(let i = 0; i < indexes_of_fixed_nums; i++){
        if(parent.gene[indexes_of_fixed_nums[i]] != child.gene[indexes_of_fixed_nums[i]]){
            reverted_child.gene[indexes_of_fixed_nums[i]] = parent.gene[indexes_of_fixed_nums[i]];            
        }        
    }
    reverted_child.fitness = fitnessFunction_list(reverted_child.gene);
    return reverted_child;
}


function mutateIndividual(individual, indexes_of_fixed_nums, mutation_chance) {
    // mutation changes a random index of the gene to settings.getRandomGeneValue()
    // mutation chance = if (random number between [0,1] is < settings.mutationRate)
    // this function modifies the individual and returns nothing
    let solved = parseSudokuString(randomGameArray[randGame][1])
    let individ = individual;
    let rand_chance = Math.random();  
    if(rand_chance < mutation_chance){
        let rand_index = Math.floor(Math.random()*(individ.gene.length));
        let grid = grids[rand_index];
        
        if(individual[rand_index]==solved[grid.dataset.block][grid.dataset.col]){return individ;}

        if(!indexes_of_fixed_nums.includes(rand_index)){
            individ.gene[rand_index] = Math.floor(Math.random()*9)+1;
            individ.fitness = fitnessFunction_list(individ.gene);
        }

    }
    return individ;
}


function getBestGene(population){
    let best_fitness = 0;
    let best_gene;
    for(let i = 0; i<population.length; i++){
        if(population[i].fitness > best_fitness){
            best_gene = population[i];
            best_fitness = population[i].fitness;
        }
    }
    return best_gene
}


function getBestFitness(population){
    let best_fitness = 0;
    for(let i = 0; i < population.length; i++){
        let fitness_score = population[i].fitness;
        if(fitness_score > best_fitness){best_fitness = fitness_score;}
    }
    return best_fitness;
}

//Sums up all the fitness values in a population
function getFitnessSum(population){
    let fitnessSum = 0;
    population.forEach((gene)=>{fitnessSum += gene.fitness;})
    return fitnessSum;
}

//Chooses a random gene from the population. But shows slight favoritism for higher fitness values.
function rouletteWheelSelection(population, fitnessSum) {
    let curr_pop = population;
    let sum = fitnessSum; 
    let pick = Math.random(0, sum);
    let current = 0;
    for(let i =0; i< population.length; i++){
        current += curr_pop[i].fitness;
        if(current > pick){return population[i];}
    }
}

// Perform crossover on two parent individuals and return the child individual
 function crossOver(parent1, parent2, indexes_of_fixed_nums) {
    // add the first half of parent1 gene to childGene
    // add the second half of parent2 gene to childGene
    let gene1 = parent1.gene;
    let gene2 = parent2.gene;
    let childGene = [];
    let crosspoint;

    // No swap when the gene length is only 1.
    if(gene1.length == 1){
        childGene = gene1;        
    // Handle when the gene length is 3.
    }else if(gene1.length == 3){
        crosspoint = 2;
        childGene.push(gene1[0]);
        childGene.push(gene1[1]);
        childGene.push(gene2[2]);  
        // Any other gene length will be swapped using floor division.
    }else{
        crosspoint = Math.floor(gene1.length/2);
        int_remaining_half = gene1.length - crosspoint;
        childGene = childGene.concat(gene1.slice(0,crosspoint));
        childGene = childGene.concat(gene2.slice(crosspoint));
    }

    return { gene: childGene, fitness: fitnessFunction_list(childGene) };
}


function getRandomGeneValue(grids){
    let random_chance = 0.5;
    let random_gene = [];
    grids.forEach((grid)=>{
                if (grid.dataset.fixed === "false") {
                    let new_int;
                    if(Math.random() < random_chance){
                        new_int = Math.floor(Math.random()*9)+1;
                        random_gene.push(new_int);
                    } else {
                        let old_int = parseInt(grid.textContent); 
                        random_gene.push(old_int);
                    }
                } else {
                    let old_int = parseInt(grid.textContent); 
                    random_gene.push(old_int);
                }
    })
    return random_gene;
}


function orderInDescFitness(unordered_population){
    let population = unordered_population;
    let desc_fitness_list = [];
    for(let i = 0; i < population.length; i++){
        desc_fitness_list.push(population[i].fitness);
    }
    desc_fitness_list.sort((a,b) => b - a);
    let ordered_population = [];
    for(let i = 0; i < desc_fitness_list.length; i++){
        for(let j = 0; j < desc_fitness_list.length; j++){
            if(desc_fitness_list[i] === population[j].fitness){
                ordered_population.push(population[j]);
                desc_fitness_list.splice(i, 1);
                population.splice(j,1).
                break; //Stop searching 
            }
        }
    }
    return ordered_population;
}


function getFixedIndexes(grids){
    let list_of_fixed_vals = [];
    let index = 0;
    grids.forEach((grid)=> {
        if(grid.dataset.fixed === "true"){list_of_fixed_vals.push(index)}
        index++;
    })
    return list_of_fixed_vals
}


function parseSudokuString(sudokuString) {
    let sudokuArray = sudokuString.split("")
    let sudokuGrid = [];
    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        let block = [];
        for (let x = 0; x < 3; x++) {
          for (let y = 0; y < 3; y++) {
            let temp_integer = sudokuArray[(i + x) * 9 + j + y];
            block.push(temp_integer);
          }
        }
        sudokuGrid.push(block);
      }
    }
 
    return sudokuGrid;
  }


function fitnessFunction_list(gene){
    let fitnessScore = 0;
    let size = Math.round(Math.sqrt(gene.length));
    let sqrt_of_size = Math.round(Math.sqrt(size));
    let solved = parseSudokuString(randomGameArray[randGame][1])

    // check block fitness
    for(let i = 0 ; i < size; i++){
        let set = new Set();
        for(let j = 0; j < size; j++){
            set.add(gene[i*size+j]);
        }
        fitnessScore += set.size;
        if(set.size === size){fitnessScore+=2;}
        
    }

    // set up temp array for better reading. refer to screenshot in goodnote
    let temp_array = [];
    for(let i = 0; i < size; i++){
        let temp_list = []; 
        for(let j = 0; j<size; j++){
            temp_list.push(gene[i*size+j])
        }
        temp_array.push(temp_list);
    }

    // check row
    for(let i = 0; i < sqrt_of_size; i++){
        let set = new Set();
        for(let j = 0; j < sqrt_of_size; j++){
            for(let k = 0; k < sqrt_of_size; k++){
                set.add(temp_array[j+(Math.floor(i/3)*3)][k+(i%3*3)])
            }
        fitnessScore += set.size;
        if(set.size === size){fitnessScore+=1;}    
        }
    }
    
    // check column
    for(let i = 0; i < sqrt_of_size; i++){
        let set = new Set();
        for(let j = 0; j < sqrt_of_size; j++){
            for(let k = 0; k < sqrt_of_size; k++){
                set.add(temp_array[j*3+i][k*3])
            }
        fitnessScore += set.size;
        if(set.size === size){fitnessScore+=1;}    
        }
    }
    
    // Great reward for each cell that turns green
    for(let i = 0; i < gene.length; i++){
        let grid = grids[i];
        if(gene[i]==solved[grid.dataset.block][grid.dataset.col] && mainArray[grid.dataset.block][grid.dataset.col]==0){
            fitnessScore += 4;
        }
    }

    return fitnessScore;
  }


// Initialize first generation of population as the int 1. Fixed grid numbers are not altered.
function generateInitPopulation(pop_size){
    let population = []
    for(let i = 0; i < pop_size; i++){
        let gene = [];
        grids.forEach((grid)=>{
            if(grid.dataset.fixed === "false"){
                gene.push(1);
            } else {
            let orig_int = parseInt(grid.textContent); 
            gene.push(orig_int);
            }
            
        })
        let fitness = fitnessFunction_list(gene);
        let single_gene = new Gene(gene, fitness);
        population.push(single_gene);
    }
    return population;    
}

// Object prototype that populates "population" arrays
class Gene {
    constructor(gene, fitness) {
        this.gene = gene;
        this.fitness = fitness;
    }
}
    
