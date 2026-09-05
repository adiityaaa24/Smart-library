from unicodedata import category

from django.contrib.auth import authenticate

from django.contrib.auth import hashers
from django.utils import timezone
from rest_framework.decorators import api_view

from rest_framework.response import Response

from .models import *
from .serializers import *



# Create your views here.


from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from .permissions import IsAdmin, IsStudent


@api_view(["POST"])
@permission_classes([AllowAny])
def admin_login_api(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user is not None and user.is_staff:
        refresh = RefreshToken.for_user(user)
        refresh["role"] = "admin"
        access = refresh.access_token

        return Response(
            {
                "success": True,
                "message": "Login Successful",
                "username": username,
                "access": str(access),
                "refresh": str(refresh),
            },
            status=200,
        )
    else:
        return Response(
            {"success": False, "message": "Invalid Credentials"},
            status=401,
        )

from rest_framework import status


@api_view(["POST"])
@permission_classes([IsAdmin])
def add_category(request):
    name = request.data.get("name")
    category_status = request.data.get("status", "1")

    is_active = True if str(category_status) == "1" else False

    category = Category.objects.create(name=name, is_active=is_active)
    serializer = CategorySerializer(category)

    
    return Response(
        {
            "success" : True,
            "message" : "Category has been created",
            "category" : serializer.data,
        },
        status = status.HTTP_201_CREATED
    )


@api_view(["GET"])
@permission_classes([IsAdmin])
def list_categories(request):
    categories = Category.objects.all().order_by("-id")

    serializer = CategorySerializer(categories, many=True)
    
    return Response(serializer.data, status = status.HTTP_200_OK)
    


from django.shortcuts import get_object_or_404  

@api_view(["PUT"])
@permission_classes([IsAdmin])
def update_category(request, id):
    category = get_object_or_404(Category, id=id)

    name = request.data.get("name")
    category_status = request.data.get("status")

    is_active = True if str(category_status) == "1" else False

    category.name = name
    category.is_active = is_active
    category.save()
    serializer = CategorySerializer(category)

    
    return Response(
        {
            "success" : True,
            "message" : "Category has been updated",
            "category" : serializer.data,
        },
        status = status.HTTP_200_OK
    )



@api_view(["DELETE"])
@permission_classes([IsAdmin])
def delete_category(request, id):
    category = get_object_or_404(Category, id=id)

    category.delete()
    
    return Response(
        {
            "success" : True,
            "message" : "Category deleted successfully",
        },
        status = status.HTTP_200_OK
    )



@api_view(["POST"])
@permission_classes([IsAdmin])
def add_author(request):
    name = request.data.get("name")
    

    author = Author.objects.create(name=name)
    serializer = AuthorSerializer(author)

    
    return Response(
        {
            "success" : True,
            "message" : "Author has been created",
            "author" : serializer.data,
        },
        status = status.HTTP_201_CREATED
    )


@api_view(["GET"])
@permission_classes([IsAdmin])
def list_authors(request):
    authors = Author.objects.all().order_by("-id")

    serializer = AuthorSerializer(authors, many=True)

    return Response(serializer.data, status = status.HTTP_200_OK)



@api_view(["PUT"])
@permission_classes([IsAdmin])
def update_author(request, id):
    author = get_object_or_404(Author, id=id)
    name = request.data.get("name")

    author.name = name
    author.save()
    serializer = AuthorSerializer(author)

    
    return Response(
        {
            "success" : True,
            "message" : "Author has been updated",
            "author" : serializer.data,
        },
        status = status.HTTP_200_OK
    )


@api_view(["DELETE"])
@permission_classes([IsAdmin])
def delete_author(request, id):
    author = get_object_or_404(Author, id=id)
    author.delete()

    return Response(
        {
            "success" : True,
            "message" : "Author deleted successfully",
        },
        status = status.HTTP_200_OK
    )


@api_view(["GET"])
@permission_classes([IsAdmin])
def list_books(request):
    books = Book.objects.all().order_by("-id")

    serializer = BookSerializer(books, many=True)

    return Response(serializer.data, status = status.HTTP_200_OK)


from rest_framework.decorators import parser_classes
from rest_framework.parsers import MultiPartParser, FormParser


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([IsAdmin])
def add_book(request):
    title = request.data.get("title")
    author_id = request.data.get("author")
    category_id = request.data.get("category")
    isbn = request.data.get("isbn")
    price = request.data.get("price")
    quantity = request.data.get("quantity")
    cover_image = request.FILES.get("cover_image")

    author = Author.objects.get(id=author_id)
    category = Category.objects.get(id=category_id)

    if Book.objects.filter(isbn=isbn).exists():
        return Response(
            {
                "success" : False,
                "message" : "Book with this ISBN already exists, Please use a different ISBN",
            },
            status = status.HTTP_400_BAD_REQUEST
        )

    book = Book.objects.create(
        title=title,
        author=author,
        category=category,
        isbn=isbn,
        price=price,
        quantity=quantity,
        cover_image=cover_image
    )
    serializer = BookSerializer(book) #single book object serialization
    
    return Response(
        {
            "success" : True,
            "message" : "Book has been created",
            "book" : serializer.data,
        },
        status = status.HTTP_201_CREATED
    )


@api_view(["PUT"])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([IsAdmin])
def update_book(request, id):
    book = get_object_or_404(Book, id=id)

    title = request.data.get("title")
    author_id = request.data.get("author")
    category_id = request.data.get("category")
    price = request.data.get("price")
    quantity = request.data.get("quantity")
    cover_image = request.FILES.get("cover_image")

    author = Author.objects.get(id=author_id)
    category = Category.objects.get(id=category_id)


    book.title = title
    book.author = author
    book.category = category
    book.price = price
    book.quantity = quantity

    if cover_image:
        book.cover_image = cover_image

    book.save()
    
    serializer = BookSerializer(book) #single book object serialization
    
    return Response(
        {
            "success" : True,
            "message" : "Book has been updated",
            "book" : serializer.data,   #single book object serialization we can use for the frontend
        },
        status = status.HTTP_200_OK
    )


@api_view(["DELETE"])
@permission_classes([IsAdmin])
def delete_book(request, id):
    book = get_object_or_404(Book, id=id)
    book.delete()

    return Response(
        {
            "success" : True,
            "message" : "Book deleted successfully",
        },
        status = status.HTTP_200_OK
    )


from django.contrib.auth.models import User

@api_view(["POST"])
@permission_classes([IsAdmin])
def admin_change_password(request):
    username = request.data.get("username")
    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")
    confirm_password = request.data.get("confirm_password")

    if new_password != confirm_password:
                return Response(
                    {
                        "success" : False,
                        "message" : "New password and confirm password do not match",
                    },
                    status = status.HTTP_400_BAD_REQUEST
                )


    if(len(new_password) < 6):
                return Response(
                    {
                        "success" : False,
                        "message" : "New password must be at least 6 characters long",
                    },
                    status = status.HTTP_400_BAD_REQUEST
                )


    try:
        user = User.objects.get(username=username, is_staff=True)


    except User.DoesNotExist:
        return Response(
            {
                "success" : False,
                "message" : "Admin user not found",
            },
            status = status.HTTP_404_NOT_FOUND
        )

    if not user.check_password(current_password):
        return Response(
            {
                "success" : False,
                "message" : "Current password is incorrect",
            },
            status = status.HTTP_400_BAD_REQUEST
        )

    user.set_password(new_password)     #Hashing the password and setting it to the user object
    user.save()

    return Response(
        {
            "success" : True,
            "message" : "Password changed successfully",
        },
        status = status.HTTP_200_OK
    )


from django.contrib.auth.hashers import make_password  #for hashing passwords
from django.db.models import Q # for complex queries like OR conditions

@api_view(["POST"])
@permission_classes([AllowAny])
def user_signup(request):
    full_name = request.data.get("full_name")
    mobile = request.data.get("mobile")
    email = request.data.get("email")
    password = request.data.get("password")
    confirm_password = request.data.get("confirmPassword")

    if password != confirm_password:
        return Response(
            {
                "success" : False,
                "message" : "Passwords do not match",
            },
            status = status.HTTP_400_BAD_REQUEST
        )

    if len(password) < 6:
        return Response(
            {
                "success" : False,
                "message" : "Password must be at least 6 characters long",
            },
            status = status.HTTP_400_BAD_REQUEST
        )

    
    # '1001' 1002 1003 1004, .......
    last_student = Student.objects.order_by("-id").first()

    if last_student and last_student.student_id.isdigit():
        new_id_int = int(last_student.student_id) + 1
        
    else:
        new_id_int = 1001

    student_id = str(new_id_int) #convert to string , "1001"

    if Student.objects.filter(email=email).exists():
        return Response(
            {
                "success" : False,
                "message" : "Email already exists",
            },
            status = status.HTTP_400_BAD_REQUEST
        )

    if Student.objects.filter(mobile=mobile).exists():
        return Response(
            {
                "success" : False,
                "message" : "Mobile number already exists",
            },
            status = status.HTTP_400_BAD_REQUEST
        )

    hashed_password = make_password(password)  #Hashing the password before saving to the database

    student = Student.objects.create(
        student_id=student_id,
        full_name=full_name,
        mobile=mobile,
        email=email,
        password=hashed_password,
        is_active=True,
    )


    return Response(
        {
            "success" : True,
            "message" : "Student created successfully",
            "student_id" : student.student_id,
        },
        status = status.HTTP_201_CREATED
    )



from django.contrib.auth.hashers import check_password

@api_view(["POST"])
@permission_classes([AllowAny])
def user_login(request):
    login_id = request.data.get("login_id")
    password = request.data.get("password")

    try:
        student = Student.objects.get(models.Q(email=login_id) | models.Q(student_id=login_id))
    except Student.DoesNotExist:
        return Response({"success": False, "message": "Invalid email or student ID"}, status=401)

    if not check_password(password, student.password):
        return Response({"success": False, "message": "Incorrect password"}, status=401)

    if not student.is_active:
        return Response({"success": False, "message": "Your account is inactive."}, status=403)

    refresh = RefreshToken.for_user(student)
    refresh["role"] = "student"
    access = refresh.access_token

    return Response(
        {
            "success": True,
            "message": "Login successful",
            "student_id": student.student_id,
            "full_name": student.full_name,
            "email": student.email,
            "access": str(access),
            "refresh": str(refresh),
        },
        status=200,
    )

@api_view(["GET"])
@permission_classes([IsStudent])
def user_stats(request):
    student = request.user   # <-- token se aaya hua actual logged-in student

    total_books = Book.objects.count()
    total_issued = IssuedBook.objects.filter(student=student).count()
    not_returned = IssuedBook.objects.filter(student=student, is_returned=False).count()

    stats = {
        "total_books": total_books,
        "total_issued": total_issued,
        "not_returned": not_returned,
    }
    return Response({"success": True, "stats": stats}, status=status.HTTP_200_OK)



@api_view(["GET"])
@permission_classes([AllowAny])
def user_list_books(request):
    books = Book.objects.select_related('category', 'author').prefetch_related('issued_records').all().order_by("title")
    serializer = BookListSerializer(books, many=True)
    return Response(
        {
            "success": True,
            "books": serializer.data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET", "PUT"])
@permission_classes([IsStudent])
def user_profile(request):
    student = request.user   # JWT token se aaya hua logged-in student

    if request.method == "GET":
        serializer = StudentSerializer(student)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "PUT":
        serializer = StudentSerializer(student, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsStudent])
def user_change_password(request):
    student = request.user   # JWT token se aaya hua logged-in student

    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")
    confirm_password = request.data.get("confirm_password")

    if new_password != confirm_password:
        return Response(
            {
                "success": False,
                "message": "New password and confirm password do not match",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(new_password) < 6:
        return Response(
            {
                "success": False,
                "message": "New password must be at least 6 characters long",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not check_password(current_password, student.password):
        return Response(
            {
                "success": False,
                "message": "Current password is incorrect",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    student.password = make_password(new_password)
    student.save()

    return Response(
        {
            "success": True,
            "message": "Password changed successfully",
        },
        status=status.HTTP_200_OK,
    )



@api_view(["GET"])
@permission_classes([IsAdmin])
def list_registered_students(request):
    students = Student.objects.all().order_by("-id")
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["PUT"])
@permission_classes([IsAdmin])
def block_student(request, id):
    student = get_object_or_404(Student, id=id)
    student.is_active = False
    student.save()
    return Response(
        {
            "success": True,
            "message": "Student has been blocked",
            "student": StudentSerializer(student).data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["PUT"])
@permission_classes([IsAdmin])
def activate_student(request, id):
    student = get_object_or_404(Student, id=id)
    student.is_active = True
    student.save()
    return Response(
        {
            "success": True,
            "message": "Student has been activated",
            "student": StudentSerializer(student).data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAdmin])
def get_student_by_student_id(request):
    student_id = request.query_params.get("student_id") or request.data.get("student_id")  # Get the student_id from query parameters or request data

    try:
        student = Student.objects.get(student_id=student_id)
        serializer = StudentSerializer(student)
        return Response({"success": True, "student": serializer.data}, status=status.HTTP_200_OK)
    except Student.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "Student not found",
            },
            status=status.HTTP_404_NOT_FOUND,
        )



@api_view(["GET"])
@permission_classes([IsAdmin])
def lookup_book_for_issue(request):
    query = request.query_params.get("q")
    try:
        book = Book.objects.get(isbn__iexact=query)  #look by isbn case insensitive
    except Book.DoesNotExist:
        book = Book.objects.filter(title__icontains=query).first()
        if not book:
            return Response(
                {
                    "success": False,
                    "message": "Book not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
    serializer = BookSerializer(book)
    return Response({"success": True, "book": serializer.data}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAdmin])
def issue_book(request):
    student_id = request.data.get("student_id")
    book_id = request.data.get("book_id")
    remark = request.data.get("remark", "")

    #fetch Student
    try:
        student = Student.objects.get(student_id=student_id)
    except Student.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "Student not found",
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    #fetch book
    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "Book not found",
            },
            status=status.HTTP_404_NOT_FOUND,
        )


    # issued_count = IssuedBook.objects.filter(book=book, is_returned=False).count()
    # available_quantity = book.quantity - issued_count

    if book.quantity <= 0:
        return Response(
            {
                "success": False,
                "message": "No available copies of this book to issue",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    issued_book = IssuedBook.objects.create(student=student, book=book, remark=remark, fine=0, is_returned=False)

    book.quantity -= 1
    book.is_issued = True
    book.save()

    return Response(
        {
            "success": True,
            "message": "Book issued successfully",
            "issued_book": {
                "id": issued_book.id,
                "student_id": issued_book.student.student_id,
                "book_title": issued_book.book.title,
                "issued_at": issued_book.issued_at,
            },
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
@permission_classes([IsAdmin])
def list_issued_books(request):
    issued_books = IssuedBook.objects.select_related('student', 'book').all().order_by("-id")
    serializer = IssuedBookSerializer(issued_books, many=True)
    return Response(
        serializer.data,
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAdmin])
def get_issued_book_details(request, id):
    issued_book = get_object_or_404(IssuedBook, id=id)
    serializer = IssuedBookSerializer(issued_book)
    return Response(serializer.data, status=status.HTTP_200_OK)


from django.utils import timezone
@api_view(["POST"])
@permission_classes([IsAdmin])
def return_book(request, id):
    issued_book = get_object_or_404(IssuedBook, id=id)

    if issued_book.is_returned:
        return Response(
            {
                "success": False,
                "message": "This book has already been returned",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    fine = request.data.get("fine", 0)

    try:
        fine = int(fine)
    except (ValueError, TypeError):
        return Response(
            {
                "success": False,
                "message": "Fine must be a valid integer",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    issued_book.is_returned = True
    issued_book.fine = fine
    issued_book.returned_at = timezone.now()
    issued_book.save()

    book = issued_book.book  # fetch the related book object child se parent ke thru access kar liye related_name ke use se

    book.quantity += 1
    book.is_issued = book.issued_records.filter(is_returned=False).exists()  # check if any other copies are still issued tp any student
    book.save(update_fields=["quantity", "is_issued"])  # update only the fields that have changed update_fields ka use karne se performance improve hoti hai kyuki sirf changed fields ko hi update karega (nahi bhi use kar sakte isko)

    return Response(
        {
            "success" : True,
            "message" : "Book returned successfully",
        },
        status=status.HTTP_200_OK   
    )


#.filter(student__student_id=student_id) filter by model

@api_view(["GET"])
@permission_classes([IsAdmin])
def student_issue_history(request, student_id):
    student = get_object_or_404(Student, student_id=student_id)
    issued_books = IssuedBook.objects.filter(student=student).select_related('student', 'book').order_by("-id")
    issues_serializer = IssuedBookSerializer(issued_books, many=True)
    student_serializer = StudentSerializer(student) # many nahi lagaya kyuki single student milega jabki ek student multiple books issue kar rakha hoga isliyer uper many lagaya

    return Response(
        {
            "success": True,
            "student": student_serializer.data,
            "issues": issues_serializer.data,
        },
        status=status.HTTP_200_OK
    )



@api_view(["GET"])
@permission_classes([IsAdmin])
def admin_dashboard_stats(request):
    # total_students = student.objects.all().count()  by default all rehta h
    total_students = Student.objects.count()
    active_students = Student.objects.filter(is_active=True).count()
    blocked_students = Student.objects.filter(is_active=False).count()

    total_books = Book.objects.count()
    available_books = Book.objects.filter(quantity__gt=0).count()  #gt = greater than 
    # out_of_stock_books = Book.objects.filter(quantity=0).count()
    out_of_stock_books = Book.objects.filter(quantity__lte=0).count()  #lte = less than or equal to

    total_categories = Category.objects.count()

    total_authors = Author.objects.count()

    total_issued = IssuedBook.objects.count()
    currently_issued = IssuedBook.objects.filter(is_returned=False).count()
    returned_count = IssuedBook.objects.filter(is_returned=True).count()

    data = {
        "total_students": total_students,
        "active_students": active_students,
        "blocked_students": blocked_students,

        "total_books": total_books,
        "available_books": available_books,
        "out_of_stock_books": out_of_stock_books,

        "total_categories": total_categories,
        "total_authors": total_authors,

        "total_issued": total_issued,
        "currently_issued": currently_issued,
        "returned_count": returned_count,
    }

    return Response(
        data,
        status=status.HTTP_200_OK
    )


@api_view(["GET"])
@permission_classes([IsStudent])
def user_issued_books(request):
    student = request.user   # JWT token se aaya hua logged-in student

    issued_books = IssuedBook.objects.filter(student=student).select_related('book', 'student').order_by("-id")
    serializer = IssuedBookSerializer(issued_books, many=True)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def public_stats(request):
    total_books = Book.objects.count()
    total_students = Student.objects.count()
    total_categories = Category.objects.count()

    return Response(
        {
            "total_books": total_books,
            "total_students": total_students,
            "total_categories": total_categories,
        },
        status=status.HTTP_200_OK,
    )


from django.conf import settings

@api_view(["GET"])
@permission_classes([AllowAny])
def debug_cloudinary(request):
    storage = settings.DEFAULT_FILE_STORAGE
    cloud_name = settings.CLOUDINARY_STORAGE.get('CLOUD_NAME')
    
    return Response({
        "storage_backend": storage,
        "cloud_name_set": bool(cloud_name),
        "cloud_name_length": len(cloud_name) if cloud_name else 0,
    })