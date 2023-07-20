## 算法分类

主要的学习方式，就是 LeetCode 刷题，算是一个刷题笔记。

### 字符串

1. 替换空格到 "%20"

这道题很简单，也就是简单的 string API。

```js
function replaceSpace(s) {
  // 把字符串变成单个字符的数组
  const chars = s.split('')
  // 替换对应字符
  const result = chars.map(cha => {
    if (cha === ' ') return '%20'
    return cha
  })
  // 返回结果拼接成的字符串
  return chars.join('')
}
```

2. 左旋字符串

字符串的左旋转操作是把字符串前面的若干个字符转移到字符串的尾部。请定义一个函数实现字符串左旋转操作的功能。比如，输入字符
串"abcdefg"和数字 2，该函数将返回左旋转两位得到的结果"cdefgab"。

其实想明白旋转的特点，也就没什么了。旋转首部到尾部，并不会改变顺序，还是把头部，按照原来的顺序一个个转到尾部的。

```js
function reverseLeftWords(s, n) {
  // 新的尾部，需要把头部旋转到尾部
  const start = s.slice(0, n)
  // 新的头部
  const rest = s.slice(n)
  return rest + start
}
```

这个方法有一个限制，旋转的不能超过字符长度。兼容超出长度，也很简单。如果把字符串旋转一周，还是它自身，也即是对长度取余后
在切片就好了。

3. 表示数值的字符串

请实现一个函数用来判断字符串是否表示数值（包括整数和小数）。

数值（按顺序）可以分成以下几个部分： 1.若干空格 2.一个 小数 或者 整数 3.（可选）一个 'e' 或 'E' ，后面跟着一个 整数 4.若
干空格

小数（按顺序）可以分成以下几个部分：

> 1.（可选）一个符号字符（'+' 或 '-'）
>
> 2.下述格式之一：至少一位数字，后面跟着一个点 '.' 至少一位数字，后面跟着一个点 '.' ，后面再跟着至少一位数字一个点 '.'
> ，后面跟着至少一位数字

整数（按顺序）可以分成以下几个部分：

> 1.（可选）一个符号字符（'+' 或 '-'） 2.至少一位数字

部分数值列举如下： ["+100", "5e2", "-123", "3.1416", "-1E-16", "0123"] 部分非数值列举如下： ["12e", "1a3.14", "1.2.3",
"+-5", "12e+5.4"]

字符串的很多算法都是苦功夫，常见的处理，如正则匹配，需要考虑很多种可能，最后就会变成各种状况的穷举。

这道题中的解法，主要基于有限状态机，其实也是一种穷举，不过穷举中也有一些可以优化的地方。

已经规定了数字的组成规则，如果逐字匹配，根据当前拿到的字符，对下一步拿到的字符，我们是有一些预期的，如果不符合预期就代表
匹配失败。

题目中已经帮我们把需要枚举的情况写好了，需要思考的就是状态流转。

开始时，可以有这几种状态，空格，符号，数字。

> 如果是空格，那么接下来还是可以是，空格，符号，数字，所以我觉得 trim 一下在判断也没问题。
>
> 如果是符号，那么后续就只能是数字。
>
> 如果是数字，接下来可以是数字，小数点，e，也就是说可以是小数，整数，科学计数法三种情况。

上述是第一步分析的例子，重复步骤，根据当前状态，以及拿到的值判断下一次可能的状态，进行状态流转。

```js
const StatusEnums = {
  INIT: 'INIT', // 初始状态 包括空格，符号，数字
  INT_SIGN: 'INT_SIGN', // 出现符号位，默认符号整型，后可以跟数字，小数点
  INT: 'INT', // 没有符号位直接是数字，默认整形，后可以跟数字，小数点，e,空格（表示结束）
  FLOAT_INT: 'FLOAT_INT', // 小数点左侧有整数的浮点，小数点后面可以跟数字，e，空格
  POINT_FLOAT: 'POINT_FLOAT', // 直接出现小数点的浮点数，后面必须跟 数字
  FLOAT: 'FLOAT', // 小数点后有一位数字的
  EXP_NO_FELLOW: 'EXP_NO_FELLOW', // 科学计数法, 只写了 e 还没有添加数字，后面必须是数字
  EXP_SIGN: 'EXP_SIGN', // 科学计数法后面跟符号位，后面必须是数字
  EXP: 'EXP', // 科学计数法，后面必须是数字
  END: 'END' // 结束状态，出现数字后再变成空格就是
}

const CharType = {
  SPACE: 'SPACE',
  POINT: 'POINT',
  NUMBER: 'NUMBER',
  SIGN: 'SIGN',
  CHAR_EXP: 'CHAR_EXP'
}
// 计算当前字符类型
function findCharType(s) {
  if (s === ' ') {
    return 'SPACE'
  } else if (s === '.') {
    return 'POINT'
  } else if (/\d/.test(s)) {
    return 'NUMBER'
  } else if (s === '+' || s === '-') {
    return 'SIGN'
  } else if (s === 'e' || s === 'E') {
    return 'CHAR_EXP'
  } else {
    return 'ILLEGAL'
  }
}
// 状态流转，初始时 INIT
const numberMap = {
  INIT: {
    SPACE: 'INIT', // 空格仍是初始状态
    SIGN: 'INT_SIGN', // 符号位，默认转换到符号整型
    NUMBER: 'INT', // 出现数字，变成 整型(无符号)
    POINT: 'POINT_FLOAT' // 直接出现小数点，变成 FLOAT
  },
  INT_SIGN: {
    NUMBER: 'INT', // 出现数字，变成 整型（有符号）
    POINT: 'POINT_FLOAT' // 直接出现小数点，变成 FLOAT
  },
  INT: {
    NUMBER: 'INT', // 重复出现数字状态不变
    POINT: 'FLOAT_INT', // 出现小数点变成浮点数
    CHAR_EXP: 'EXP_NO_FELLOW', // 出现 e 是科学计数法，后面只能是 数字或 空格
    SPACE: 'END' // 出现 SPACE 就是结束，不能出现 SPACE 之外的字符
  },
  FLOAT_INT: {
    NUMBER: 'FLOAT', // 出现数字，代表小数点右侧有数字，就是合理的浮点数
    CHAR_EXP: 'EXP_NO_FELLOW', // 出现 e 是科学计数法，后面只能是 数字或 空格
    SPACE: 'END'
  },
  POINT_FLOAT: {
    NUMBER: 'FLOAT' // 左侧没有数字的小数点，右侧必须跟数字
  },
  FLOAT: {
    NUMBER: 'FLOAT',
    CHAR_EXP: 'EXP_NO_FELLOW',
    SPACE: 'END'
  },
  EXP_NO_FELLOW: { NUMBER: 'EXP', SIGN: 'EXP_SIGN' },
  EXP_SIGN: { NUMBER: 'EXP' },
  EXP: {
    NUMBER: 'EXP',
    SPACE: 'END'
  },
  END: {
    SPACE: 'END'
  }
}

function validateNumber(s) {
  let state = 'INIT'
  for (let i = 0; i < s.length; i++) {
    const cha = s[i]
    const type = findCharType(cha)
    const nextState = numberMap[state][type]
    if (!nextState) {
      state = 'FAIL'
      break
    }
    state = nextState
  }
  return state === 'INT' || state === 'FLOAT_INT' || state === 'FLOAT' || state === 'EXP' || state === 'END'
}
```

### 链表

链表是一种非连续的数据结构，不同于数组。

数组中存放数据，在地址上是连续的。数组查找，通过数组的开始位置地址，加上 index（相对首位的偏移量）拿到，查找起来非常高效
。数组需要占用连续的空间，为了管理方便，一些语言中数组大小是固定。需要连续空间还意味着，不能充分利用碎片话的存储空间。

链表的查找是通过每个节点中存放的指向下一级的指针，向下查找。好处是在地址空间上可以不连续，但是每次查找都要从开始位置，一
级级查找。

一个基础的链表实现：

```js
function ListNode(val) {
  this.val = val
  this.next = null
}
```

链表非常能锻炼递归思维。

1. 从尾到头打印链表

输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回）。

```js
function reversePrint(head) {
  // 确定递归条件，没有就是空
  if (!head) return []
  // 从尾到头遍历，所以要先获取 next 返回的结果
  const result = reversePrint(head.next)
  // 将当前结果写入并返回
  result.push(head.val)
  return result
}
```

2. 反转链表

定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。

反转链表的方法，很值得思考，其实和上面也是大同小异。

首先一定是深度遍历到尾部，并且还要将尾部返回出来，接着需要反转节点。

```js
function reverseList(head) {
  // !head.next 很好理解，到达末尾了
  // !head 是为了排除空链表情况
  if (!head || !head.next) return head
  // 注意，这里保证接受到尾部的返回
  // 后续的处理不能再有返回情况，仅仅将这里的结果返回出去
  const newHead = reverseList(head.next)
  // 改变指向方向
  // head.next 是下一个节点，需要将下一个节点的 next 指向自身
  head.next.next = head
  // 清空 next 以免循环指向
  head.next = null
  return newHead
}
```

3. 链表中倒数第 k 个节点

输入一个链表，输出该链表中倒数第 k 个节点。为了符合大多数人的习惯，本题从 1 开始计数，即链表的尾节点是倒数第 1 个节点。

例如，一个链表有 6 个节点，从头节点开始，它们的值依次是 1、2、3、4、5、6。这个链表的倒数第 3 个节点是值为 4 的节点。

这道题被分在双指针里面，确实更合理点。我这里就不改了。双指针查找倒数第 K 个的元素的方法，也可以用在别的数据结构上。我是
觉得双指针和链表更配。

```js
function getKthFromEnd(head, k) {
  // 双指针
  let slow = head,
    fast = head
  // 固定指针间差距
  while (k) {
    fast = fast.next
    k--
  }
  // 当 fast 到达尾部遍历结束
  while (fast) {
    slow = slow.next
    fast = fast.next
  }
  return slow
}
```

### 栈和队列

1. 滑动窗口的最大值

​ 给定一个数组 `nums` 和滑动窗口的大小 `k`，请找出所有滑动窗口里的最大值。

示例:

> 输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3 输出: [3,3,5,5,6,7] 解释:
>
> 滑动窗口的位置 最大值
>
> ---
>
> [1 3 -1] -3 5 3 6 7  
> 1 [3 -1 -3] 5 3 6 7  
> 1 3 [-1 -3 5] 3 6 7  
> 1 3 -1 [-3 5 3] 6 7  
> 1 3 -1 -3 [5 3 6] 7  
> 1 3 -1 -3 5 [3 6 7]

这道题很有意思，首先想到的一定是暴力解法，让窗口滑动，找到窗口的最大值。这样每次滑动，都要遍历一遍当前窗口内容，最终的时
间复杂度就是 O(nk)。

优化的点也很好想到，每次滑动只会弹出左侧数字，压入右侧数字，中间的内容都没有动。怎么标记复用中间部分的信息就很重要。我最
开始想的对比前一个区间的最大值，和当前推入窗口值，找到更大的。也就是说，一开始我想只维护最大值信息。这样当最大值离开窗口
时，还需要再次查找最大值，其实和暴力解法差别不大。尤其是递减的数组，就和暴力解法完全一样。

问题就在于，怎么快速查找次大值。继续分析，发现如果最大值左侧的值对结果是没有影响的。每当窗口右侧进来一个最大值，如果后续
没有进来更大值，无论左侧滑出的值是什么，都不影响结果。当最大值滑出区域，当前窗口最大值，就是之前的次大值和新进去窗口的值
进行比较的结果。

这里可以使用一个单调队列，队列单调递减，每次移动维护这个队列，队列中保存有数据的值，以及对应的 index。用例子来说明，第一
步`[1 3 -1]`，我们只需要记录 `[{value: 3, index: 1} , {value: -1, index: 2}]`。3 一定比 1 晚出窗口，存在 3 最大值一定不
会是 1。 -1 < 3 需要保留，当 3 移出窗口时，接下来最大值就是 -1 。如果窗口中是这样的 `[3, -1, -3, 1]`，需要保留 3 和
1，-1 和 -3 都小于 1 不用保留。

总结起来就是如果右侧是递减就保留，数字增加，左侧较小的值都要舍弃掉。这样维护的队列里，值是单调递减的，所以叫单调队列。

```js
function maxSlidingWindow(nums, k) {
  // 空数组和一个元素的数组结果就是自身
  if (!nums.length || nums.length === 1) return nums
  const result = []
  // 先生成第一个窗口的队列
  const queue = [{ value: nums[0], index: 0 }]
  // 遍历窗口长度的数据
  for (let i = 1; i < k; i++) {
    // 如果新值大于尾部的值，需要将尾部弹出，继续向前查找
    // 直到找到比它大的值，或者数组清空（它就是目前的最大值）
    // 相等需要取后一个，不然前一个值出了窗口，后一个值的信息丢失了
    while (queue.length && nums[i] >= queue[queue.length - 1].value) {
      queue.pop()
    }
    queue.push({ value: nums[i], index: i })
  }
  // 将第一个窗口的值写入
  result.push(queue[0].value)
  for (let j = k; j < nums.length; j++) {
    // 最大值移出窗口
    if (queue[0].index < j - k + 1) {
      queue.shift()
    }

    while (queue.length && nums[j] >= queue[queue.length - 1].value) {
      queue.pop()
    }
    queue.push({ value: nums[j], index: j })

    result.push(queue[0].value)
  }

  return result
}
```

2. 栈的压入、弹出序列

输入两个整数序列，第一个序列表示栈的压入顺序，请判断第二个序列是否为该栈的弹出顺序。假设压入栈的所有数字均不相等。例如，
序列 {1,2,3,4,5} 是某栈的压栈序列，序列 {4,5,3,2,1} 是该压栈序列对应的一个弹出序列，但 {4,3,5,1,2} 就不可能是该压栈序列
的弹出序列。

这道题弹出位置和位数都不确定，例如，可以 push 1，push 2，然后 pop 2，pop 1，在 push 3 4 5，依次弹出，这样 pop 就是
`[2, 1, 5, 4, 3]`。

压入顺序一定是从左至右，这样就需要模拟弹出次序。

```js
function validateStackSequences(pushed, popped) {
  // next 表示下一个压入的值， remain 表示栈中原有的值
  // 把压入看作 pushed 上 next 往右走
  // pop 看作 remain 往左走
  // 已经 pop 过的数据需要标记
  let next = 0,
    remain = -1
  for (let i = 0; i < popped.length; i++) {
    // 先拦截弹出操作
    // 弹出后 remain 回到栈顶
    if (pushed[remain] === 'done') {
      remain--
      while (pushed[remain] === 'done' && remain >= 0) remain--
    }

    // 判断是否弹出阶段
    if (remain >= 0 && pushed[remain] === popped[i]) {
      pushed[remain] = 'done'
      continue
    }
    // 弹出已经完成，接下来是压入
    // 从 pushed 查找 popped 当前值
    // 不相等，证明还是压入阶段 继续找
    while (pushed[next] !== popped[i] && next < pushed.length) {
      next++
      remain = next
    }
    // 超出区间还没有找到，证明没有
    if (next >= pushed.length && pushed[remain] !== popped[i]) return false
    // 找到标记弹出
    pushed[remain] = 'done'
  }
  return true
}
```

### 二叉树和 BFS, DFS

二叉树是一种常见的数据结构，包含节点自身的值，以及左右两个子树，基本结构如下

```js
function TreeNode(val) {
  this.val = val
  this.left = this.right = null
}
```

DFS（Depth first search） 就很有意思了。DFS 就是深度优先搜索，和 BFS（广度优先搜索，Breadth first search）不一样。BFS 需
要记住同层级每个节点，进行遍历。DFS 会沿着树的一支，穿行到底，再返回。语言上描述很简单，这里涉及到回溯的问题。DFS 每次返
回，需要将状态重置到上一层。简单看两道题：

1. 从上到下打印二叉树(BFS)

从上到下打印出二叉树的每个节点，同一层的节点按照从左到右的顺序打印。

例如: 给定二叉树: `[3,9,20,null,null,15,7]`

```
    3
   / \
  9  20
    /  \
   15   7
```

结果： [3,9,20,15,7]

典型的 BFS：

```js
function levelOrder(root) {
  // 空树直接返回空数组
  if (!root) return []
  const result = []
  // 保存每一层的节点
  const queue = []
  queue.push(root)
  while (queue.length) {
    // 取出当前队列中的首个元素
    const head = queue.shift()
    // 如果节点有值
    if (head) {
      // 将结果写入
      result.push(head.val)
      // 将下一层节点放入尾部
      queue.push(head.left)
      queue.push(head.right)
    }
  }
  return result
}
```

2. 树的子树

输入两棵二叉树 A 和 B，判断 B 是不是 A 的子结构。(约定空树不是任意一个树的子结构)

B 是 A 的子结构， 即 A 中有出现和 B 相同的结构和节点值。

```js
function isSubStructure(A, B) {
  // 空树不是子树
  if (!A || !B) return false
  // 判断根和别的节点不同
  // 对于子节点，空节点是不影响结果的
  // 例如 node a val 是 1  右子树是 2 左子树是 3
  // node b val 是 1  右子树是 2 左子树是 null
  // 这种情况 b 是 a 的子树

  // 判断当前树，或者 A 的左右子树
  return isSubNode(A, B) || isSubStructure(A.left, B) || isSubStructure(A.right, B)
  // 也就是子树，可以缺少节点，但是不能存在不同节点
  // 判断节点是否相同，和判断树不同，空节点是成功的
  function isSubNode(a, b) {
    // 递归结束条件应该是节点遍历完成
    // 并且没有找到不同
    if (!b) return true
    // 如果 a 没有，b 有，说明多了一个节点
    if (!a || a.val !== b.val) return false
    // 只判断当前节点是否相同，要判断左右子树是否相同，或者 b 没有
    return isSubNode(a.left, b.left) && isSubNode(a.right, b.right)
  }
}
```

3. 二叉树镜像

反转二叉树，递归的话很简单。

```js
function mirrorTree(root) {
  // 递归第一步永远是确定递归边界条件
  if (!root) return root
  // 递归调用
  // 只要边界条件对，就只需要思考，每一步究竟干了什么
  // 这里就是调换左右子树
  // 至于其他的，递归会自己找到答案
  const left = mirrorTree(root.right)
  const right = mirrorTree(root.left)
  root.left = left
  root.right = right
  // 别忘了返回
  return root
}
```

4. 二叉搜索树与双向列表

二叉搜索树，就是一个左树值比节点值小，节点值比右树小的二叉树。转换后的双向循环列表，从小到大排列，left 指向前驱节点
，right 指向后续节点。

具体还是看 leetcode 上的[原题](https://leetcode.cn/problems/er-cha-sou-suo-shu-yu-shuang-xiang-lian-biao-lcof/)

```js
function treeToDoublyList(root) {
  if (!root) return root
  // 二叉搜索树，左子树小于根节点小于右子树
  // 转成双向链表是从小到大
  // 所以是一个中序遍历
  // 需要保存左子树遍历的最后一个节点
  //      A
  //     / \
  //    B   C
  // 对于这样的结构， A 节点前驱和后继指向是没有问题的
  // 但是 B 的 right 需要指向 A
  // C 的 left 需要指向 A
  // 另外遍历完成后，A 的父节点的 left 需要指向的是 C
  // 所以需要保留上次遍历的最后一个节点
  // 最后一次遍历就会使 pre 变成 tail
  let pre
  // 放头部
  let head

  dfs(root)
  head.left = pre
  pre.right = head
  // 返回头部
  return head

  // 中序遍历
  function dfs(node) {
    if (!node) return []
    // 根节点的前后节点指向是正常的
    // 首先会一直沿着左子树，穿行到底
    dfs(node.left)
    // 对于单个节点，最后产生作用的其实都是这一步
    // 所以需要在这一步保存 pre
    // 如果没有值就是最左侧
    if (!pre) head = node
    if (pre) {
      pre.right = node
      node.left = pre
    }
    pre = node
    dfs(node.right)
  }
}
```

有一点卡了我很久，dfs 我是一下子就写出来了。明白题意后就知道要用中序遍历，但是递归里的指针指向处理难住了我。

注释中我也写了，这里准备写详细点。

递归的处理，一般都是倒退（我是这么思考的），那我就考虑了最简单的情况，假设只有一个节点，节点有左子树和右子树。

```
​   A ​
  / \
 B   C
```

这样的结构中，A 的 left 指向 B，right 指向 C，对于二叉搜索树，已经符合了我们需要的从小到大要求。只需要将 B 的 right 指向
A，C 的 left 指向 A 就完成循环列表的指向了。

思考下一步的递归是，我遇到了问题。假设 A 是 P 的左子树，P 目前的 left 指向的是 A。记得嘛，上一步的处理中我们跳过了根节点
，但是在这里不行了。P 的 left 实际上应该指向 C。在递归回到 P 的时候，已经没有办法获取到 C 了。

如果不嫌弃麻烦，dfs 可以将 node 组成的数组返回出来，如返回左子树 node 组成的节点，拿到最后一个就是 C。或者获取整个 node
list，遍历去修改指针也可以。

遍历就会增加一次 O(n) 的操作，直观上也会觉得很多余。

这一步的思考并非毫无作用，提醒了我一件事。DFS 或者遍历，都是遍历一遍，O(n) 的操作，两次遍历的顺序没有任何区别。考虑遍历
数组时做了什么。除头尾需要分别处理，剩下的就是将上一个节点的 right 指向下一个节点，将当前节点的 left 指向上个节点。DFS
中当然可以拿到当前节点，就是上个节点麻烦。看到重点了吗？需要获取上个节点，那就保存一下上个节点。

5. 二叉树的最大深度

输入一棵二叉树的根节点，求该树的深度。从根节点到叶节点依次经过的节点（含根、叶节点）形成树的一条路径，最长路径的长度为树
的深度。

```js
function maxDepth(root) {
  if (!root) return 0
  // 左子树深度
  const left = maxDepth(root.left) + 1
  // 右子树深度
  const right = maxDepth(root.right) + 1
  // 返回最大
  return Math.max(left, right)
}
```

6. 重建二叉树

输入某二叉树的前序遍历和中序遍历的结果，请构建该二叉树并返回其根节点。假设输入的前序遍历和中序遍历的结果中都不含重复的数
字。

这道题需要了解前序遍历，中序遍历特点。所谓的前、中、后，针对的是根节点遍历顺序。首先遍历根节点，再遍历左、右子树，是前序
。先遍历左子树，在到根节点，然后右子树，是中序遍历。无论哪种，都是先遍历左子树，后遍历右子树。

无论哪种遍历方式，都是遍历所有节点，节点数是不会变的。这样递归去看左右子树，就可以将过程分解。首先根据前序遍历拿到根节点
，再从中序中找到根节点位置。这样中序遍历，去掉根节点，就是左右子树的中序遍历结果。由于节点相同，同样可以切割前序遍历，获
得左右子树的前序遍历结果，接下来就是递归。

还有一个重点，就是树中没有重复数字。如果存在重复数字，就没法很好定位根节点位置。

这道题利用了分治算法的思路，先做拆分，再递归处理拆分出的部分。

```js
function buildTree(preorder, inorder) {
  if (!preorder || !preorder.length) return null
  // 根据前序遍历特点，首先能获取根节点
  const rootVal = preorder.shift()
  const root = new TreeNode(rootVal)

  // 中序遍历特点是，先遍历左子树，然后是根节点，最后是右子树
  // 现在已经拿到了根节点，可以根据根节点所在位置
  // 拆分所属左子树的节点，和右子树的节点
  // 无论哪种遍历方式，树的节点数都是一样的
  // 根据节点数，可以拿到左右子树的前序遍历
  // 分别递归左右子树

  // root 在中序遍历中的位置
  const rootPos = inorder.findIndex(val => val === rootVal)
  // 切割中序遍历的左树结果
  const inLeft = inorder.slice(0, rootPos)
  // 切割中序遍历的右树结果
  const inRight = inorder.slice(rootPos + 1)
  // 节点数相同，所以同样切割前序遍历的左树
  const preLeft = preorder.slice(0, rootPos)
  // 前序已经将根节点取出，所以直接冲 rootPos 取
  const preRight = preorder.slice(rootPos)
  // 递归左右节点
  const leftNode = buildTree(preLeft, inLeft)

  const rightNode = buildTree(preRight, inRight)

  root.left = leftNode
  root.right = rightNode

  return root
}
```

代码有很大优化空间，可以通过创建 map，建立值对 index 的 map，可以快速查找，不需要每次都 findIndex。如果使用指针的方式，
而不是切割数组，也可以节省空间复杂度。

7. 二叉树后续遍历

输入一个整数数组，判断该数组是不是某二叉搜索树的后序遍历结果。如果是则返回 `true`，否则返回 `false`。假设输入的数组的任
意两个数字都互不相同。

```js
function verifyPostorder(postorder) {
  // 后序遍历结果，根节点在最后
  // 二叉搜素树，左树节点 < 根节点 < 右树节点
  // 基本思路应该是，先获取根节点
  // 查找小于根节点的值
  // 拆分左右子树
  // 接着递归
  // 递归结束条件，空树，或者只有一个元素
  if (!postorder.length || postorder.length === 1) return true
  // 获取根节点
  const root = postorder[postorder.length - 1]
  // 找到右子树的开始阶段
  const rightStart = postorder.findIndex(val => val > root)
  // 左树节点
  const left = postorder.slice(0, rightStart)
  // 右树节点
  const right = postorder.slice(rightStart, postorder.length - 1)
  // 如果左子树有大于根节点，或者右子树有小于根节点的值，都是不成立的
  if (left.findIndex(val => val > root) > -1 || right.findIndex(val => val < root) > -1) return false

  return verifyPostorder(left) && verifyPostorder(right)
}
```

同样可以使用指针优化，参考 leetcode 上 Krahets 的解答。使用双指针，减少使用空间，同时删除了左子树的判断。

```js
function verifyPostorder(postorder) {
  function helper(i, j) {
    // 递归结束条件，空树，或者只有一个元素
    if (i >= j) return true
    // 获取根节点
    const root = postorder[j]
    // 拆分左右子树
    let p = i
    // 首先找到连续的小于 root 的节点，就是左子树的节点
    while (postorder[p] < root) p++
    // 保存左子树指针
    const m = p
    // 查找右子树值
    // 如果右子树中存在小于 root 的节点
    // 就会停止
    while (postorder[p] > root) p++
    // 如果 p， j 不相等，证明右子树有小于 root 的值
    // 递归右子树需要去除 root
    return p === j && helper(i, m - 1) && helper(m, j - 1)
  }
  return helper(0, postorder.length - 1)
}
```

### 排序

需要了解一下基本的排序方法，首先看快速排序，这里两种实现方式，一种是遍历交换，非常符合直觉的一种方法。第二种是填空法，需
要前后循环填空。注释应该都写的很清楚了。代码来自 [菜鸟](https://www.runoob.com/w3cnote/quick-sort-2.html)。

```js
function quickSort(arr, left, right) {
  // 递归时候使用，如果没传，默认是第一次
  var len = arr.length,
    partitionIndex,
    left = typeof left != 'number' ? 0 : left,
    right = typeof right != 'number' ? len - 1 : right

  // 递归终止条件
  if (left < right) {
    // 获取排序后基准值所在位置
    partitionIndex = partition(arr, left, right)
    // 基准值排序完成，分别排序前后部分
    quickSort(arr, left, partitionIndex - 1)
    quickSort(arr, partitionIndex + 1, right)
  }
  return arr
}

function partition(arr, left, right) {
  // 默认左侧是基准值
  var pivot = left,
    index = pivot + 1
  // 从基准值右边开始遍历
  for (var i = index; i <= right; i++) {
    // 小于基准值就做交换，变到前面来
    if (arr[i] < arr[pivot]) {
      swap(arr, i, index)
      // 当前位置已经交换过需要自增
      // 如果开始时候就小于，index 还是会自增
      // 如果出现 index 和 i 的不同步
      // 说明当时 index 指向的值大于等于 arr[pivot]
      // 后续需要做交换
      // 之后遇到小于的值会立刻做交换
      // 假如此时 i 和 index 中间有值
      // 这些值一定是大于等于 arr[pivot]
      index++
    }
  }
  // 整个过程中，没有移动 pivot
  // 最后需要将 pivot 移动到排序后的位置
  swap(arr, pivot, index - 1)
  // 返回基准值所在位置
  return index - 1
}
// 交换数据
function swap(arr, i, j) {
  var temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

function partition2(arr, low, high) {
  // 这里使用的填空法
  // 首先将基准值取出
  // 可以看作首位已经空了
  let pivot = arr[low]
  while (low < high) {
    // 找到右侧，小于等于基准值的值
    while (low < high && arr[high] > pivot) {
      --high
    }
    // 将需要放到基准值前的数字推入前面的空位中
    arr[low] = arr[high]
    // 找到右侧需要放到基准值右侧的值
    while (low < high && arr[low] <= pivot) {
      ++low
    }
    // 将值填到后面的空位中
    arr[high] = arr[low]
  }
  // 遍历完成 low 和 high 汇集到一点
  // 就是基准值需要在的位置
  arr[low] = pivot
  return low
}

function quickSort2(arr, low, high) {
  if (low < high) {
    let pivot = partition2(arr, low, high)
    quickSort2(arr, low, pivot - 1)
    quickSort2(arr, pivot + 1, high)
  }
  return arr
}
```
