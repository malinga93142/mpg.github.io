/**
 * @file set_operations.c
 * @brief Implements set operations using linked lists.
 * 
 * This program provides functions to create sets, add elements, 
 * find intersections, compute set differences, and release memory.
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

/**
 * @struct list
 * @brief Represents a node in a linked list.
 */
typedef struct list{
  int data;           /**< Data stored in the node */
  struct list* next;  /**< Pointer to the next node */
} list_t;

/**
 * @struct set
 * @brief Represents a set using a linked list.
 */
typedef struct{
  list_t *head; /**< Pointer to the head of the linked list */
  int count;    /**< Number of elements in the set */
} set;

/**
 * @brief Creates a new node.
 * @param k The data to store in the node.
 * @return A pointer to the newly created node.
 */
list_t *createnode(int k){
  list_t *newnode = (list_t*)malloc(sizeof(list_t));
  newnode->data   = k;
  newnode->next   = NULL;
  return newnode;
}

/**
 * @brief Creates a new set with an initial element.
 * @param k The first element of the set.
 * @return A pointer to the newly created set.
 */
set *createset(int k){
  set* newset = (set*)malloc(sizeof(set));
  newset->head = createnode(k);
  newset->count= 1;
  return newset;
}

/**
 * @brief Inserts an element at the end of the list.
 * @param head The head of the list.
 * @param elem The element to insert.
 * @return The updated list.
 */
list_t *insert(list_t* head, int elem){
  if(head == NULL) return createnode(elem);
  list_t *temp = head;
  while(temp->next != NULL){
    temp = temp->next;
  }
  temp->next = createnode(elem);
  return head;
}

/**
 * @brief Adds an element to a set.
 * @param s The set to add to.
 * @param e The element to add.
 * @return The updated set.
 */
set* add(set* s, int e){
  if(s == NULL) return createset(e);
  s->head = insert(s->head, e);
  s->count++;
  return s;
}

/**
 * @brief Checks if an element exists in the list.
 * @param h The head of the list.
 * @param k The element to check.
 * @return `true` if the element exists, `false` otherwise.
 */
bool has(list_t *h, int k){
  if(h == NULL) return false;
  while(h != NULL && h->data != k) h = h->next;
  return h != NULL;
}

/**
 * @brief Computes the intersection of two sets.
 * @param s1 The first set.
 * @param s2 The second set.
 * @return A new set representing the intersection.
 */
set *intersection(set *s1, set* s2){
  if(s1 == NULL || s2 == NULL) return NULL;
  set *newset = NULL;
  list_t *temp = s1->head;
  while(temp != NULL){
    if(has(s2->head, temp->data)){
      newset = add(newset, temp->data);
    }
    temp = temp->next;
  }
  return newset;
}


/**
 * @brief Computes the difference between two sets (s1 - s2).
 * @param s1 The first set.
 * @param s2 The second set.
 * @return A new set representing the difference (elements in s1 but not in s2).
 */
set* set_difference(set *s1, set *s2){
  if(s1 == NULL)
    return NULL;
  if(s2 == NULL){
    set *copy = NULL;
    list_t *newlist = s1->head;
    while(newlist != NULL){
      copy = add(copy, newlist->data);
      newlist = newlist->next;
    }
    return copy;
  }

  list_t *temp1 = s1->head;
  set *newset = NULL;
  while(temp1 != NULL){
    if(!has(s2->head, temp1->data))
      newset = add(newset, temp1->data);
    temp1 = temp1->next;
  }
  return newset;
}

/**
 * @brief Releases allocated memory for a set.
 * @param ptr The set to free.
 */
void release_mem(set* ptr){
  if(ptr == NULL) return;
  list_t *__temp = ptr->head;
  while(__temp != NULL){
    list_t *next = __temp->next;
    free(__temp);
    __temp = next;
  }
  free(ptr);
}
/**
 * @brief Prints the elements of a set.
 * @param s The set to print.
 */
void print_set(set *s){
  if(s == NULL || s->head == NULL){
    printf("{}\n");
    return;
  }
  list_t *head = s->head;
  while(head != NULL){
    printf("%d ", head->data);
    head = head->next;
  }
  printf("\n");
}

/**
 * @brief Main function to demonstrate set operations.
 */
int main(void){
  set *s1 = NULL;
  s1 = add(s1, 10);
  s1 = add(s1, 20);
  s1 = add(s1, 30);
  s1 = add(s1, 40);
  print_set(s1);

  set *s2 = NULL;
  s2 = add(s2, 10);
  s2 = add(s2, 30);
  s2 = add(s2, 50);
  s2 = add(s2, 70);
  print_set(s2);

  printf("total elems in set1: %d\n", s1->count);
  printf("total elems in set2: %d\n", s2->count);

  set *s3 = intersection(s1, s2);
  print_set(s3);
  printf("total elems in set3: %d\n", s3->count);

  set *s4 = set_difference(s1, s2);
  printf("total elems in set4: %d\n", s4->count);
  print_set(s4);

  set *s5 = set_difference(s2, s1);
  printf("total elems in set5: %d\n", s5->count);
  print_set(s5);

  release_mem(s1);
  release_mem(s2);
  release_mem(s3);
  release_mem(s4);
  release_mem(s5);

  return 0;
}

