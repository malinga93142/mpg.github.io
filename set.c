#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct list{
  int data;
  struct list* next;
}list_t;

typedef struct{
  list_t *head;
  int count;
}set;
list_t *createnode(int k){
  list_t *newnode = (list_t*)malloc(sizeof(list_t));
  newnode->data   = k;
  newnode->next   = NULL;
  return newnode;
}

set *createset(int k){
  set* newset = (set*)malloc(sizeof(set));
  newset->head = createnode(k);
  newset->count= 1;
  return newset;
}
list_t *insert(list_t* head, int elem){
  if(head == NULL)  return createnode(elem);
  list_t *temp = head;
  while(temp->next != NULL){
    temp = temp->next;
  }
  temp->next = createnode(elem);
  return head;
}

set* add(set* s, int e){
  if(s == NULL) return createset(e);
  s->head = insert(s->head, e);
  s->count++;
  return s;
}

bool has(list_t *h, int k){
  if(h == NULL) return false;
  while(h != NULL && h->data != k) h = h->next;
  if(h == NULL) return false;
  return true;
}


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

void release_mem(set* ptr){
  if(ptr == NULL) return;
  list_t *__temp = ptr->head;
  while(__temp != NULL){
    list_t *next = __temp->next;
    free(__temp);
    __temp = next;
  }
  free(ptr);
  ptr = NULL;
}


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

  list_t *temp1 =s1->head;
  set *newset = NULL;
  while(temp1 != NULL){
    if(!has(s2->head, temp1->data))
      newset = add(newset, temp1->data);
    temp1 = temp1->next;
  }
  return newset;
}
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
