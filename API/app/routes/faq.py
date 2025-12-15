"""
FAQ Routes - UMKM FAQ/Consultation Management
"""
from datetime import datetime

from app.models import FAQ, Consultation, FAQCategory
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app import db

faq_bp = Blueprint('faq', __name__)


# ==================== FAQ Categories ====================

@faq_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all FAQ categories"""
    try:
        categories = FAQCategory.query.filter_by(is_active=True)\
            .order_by(FAQCategory.urutan.asc()).all()
        
        return jsonify({
            'success': True,
            'data': [c.to_dict() for c in categories]
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to get categories: {str(e)}'
        }), 500


@faq_bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    """Create new FAQ category"""
    try:
        data = request.get_json()
        
        if not data.get('nama'):
            return jsonify({
                'success': False,
                'message': 'Nama is required'
            }), 400
        
        category = FAQCategory(
            nama=data['nama'],
            deskripsi=data.get('deskripsi'),
            icon=data.get('icon'),
            color=data.get('color'),
            urutan=data.get('urutan', 0)
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Category created successfully',
            'data': category.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to create category: {str(e)}'
        }), 500


# ==================== FAQ ====================

@faq_bp.route('', methods=['GET'])
def get_faqs():
    """Get all FAQs"""
    try:
        # Query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        category_id = request.args.get('category_id', type=int)
        featured = request.args.get('featured', type=bool)
        
        # Build query
        query = FAQ.query.filter_by(is_active=True)
        
        if search:
            query = query.filter(
                db.or_(
                    FAQ.pertanyaan.ilike(f'%{search}%'),
                    FAQ.jawaban.ilike(f'%{search}%'),
                    FAQ.keywords.ilike(f'%{search}%')
                )
            )
        if category_id:
            query = query.filter_by(category_id=category_id)
        if featured:
            query = query.filter_by(is_featured=True)
        
        # Paginate
        pagination = query.order_by(FAQ.urutan.asc(), FAQ.views.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        faqs = [f.to_dict() for f in pagination.items]
        
        return jsonify({
            'success': True,
            'data': faqs,
            'pagination': {
                'page': page,
                'perPage': per_page,
                'total': pagination.total,
                'pages': pagination.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to get FAQs: {str(e)}'
        }), 500


@faq_bp.route('/<int:faq_id>', methods=['GET'])
def get_faq(faq_id):
    """Get single FAQ by ID"""
    try:
        faq = FAQ.query.get(faq_id)
        
        if not faq:
            return jsonify({
                'success': False,
                'message': 'FAQ not found'
            }), 404
        
        # Increment views
        faq.views += 1
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': faq.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to get FAQ: {str(e)}'
        }), 500


@faq_bp.route('', methods=['POST'])
@jwt_required()
def create_faq():
    """Create new FAQ"""
    try:
        data = request.get_json()
        
        if not data.get('pertanyaan') or not data.get('jawaban'):
            return jsonify({
                'success': False,
                'message': 'Pertanyaan and jawaban are required'
            }), 400
        
        faq = FAQ(
            category_id=data.get('categoryId'),
            pertanyaan=data['pertanyaan'],
            jawaban=data['jawaban'],
            tags=data.get('tags'),
            keywords=data.get('keywords'),
            urutan=data.get('urutan', 0),
            is_featured=data.get('isFeatured', False)
        )
        
        db.session.add(faq)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'FAQ created successfully',
            'data': faq.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to create FAQ: {str(e)}'
        }), 500


@faq_bp.route('/<int:faq_id>', methods=['PUT'])
@jwt_required()
def update_faq(faq_id):
    """Update FAQ"""
    try:
        faq = FAQ.query.get(faq_id)
        
        if not faq:
            return jsonify({
                'success': False,
                'message': 'FAQ not found'
            }), 404
        
        data = request.get_json()
        
        if 'categoryId' in data:
            faq.category_id = data['categoryId']
        if 'pertanyaan' in data:
            faq.pertanyaan = data['pertanyaan']
        if 'jawaban' in data:
            faq.jawaban = data['jawaban']
        if 'tags' in data:
            faq.tags = data['tags']
        if 'keywords' in data:
            faq.keywords = data['keywords']
        if 'urutan' in data:
            faq.urutan = data['urutan']
        if 'isFeatured' in data:
            faq.is_featured = data['isFeatured']
        if 'isActive' in data:
            faq.is_active = data['isActive']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'FAQ updated successfully',
            'data': faq.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to update FAQ: {str(e)}'
        }), 500


@faq_bp.route('/<int:faq_id>', methods=['DELETE'])
@jwt_required()
def delete_faq(faq_id):
    """Delete FAQ"""
    try:
        faq = FAQ.query.get(faq_id)
        
        if not faq:
            return jsonify({
                'success': False,
                'message': 'FAQ not found'
            }), 404
        
        db.session.delete(faq)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'FAQ deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to delete FAQ: {str(e)}'
        }), 500


@faq_bp.route('/<int:faq_id>/feedback', methods=['POST'])
def faq_feedback(faq_id):
    """Submit feedback for FAQ"""
    try:
        faq = FAQ.query.get(faq_id)
        
        if not faq:
            return jsonify({
                'success': False,
                'message': 'FAQ not found'
            }), 404
        
        data = request.get_json()
        is_helpful = data.get('isHelpful', True)
        
        if is_helpful:
            faq.helpful_count += 1
        else:
            faq.not_helpful_count += 1
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Feedback submitted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to submit feedback: {str(e)}'
        }), 500


# ==================== Consultations ====================

@faq_bp.route('/consultations', methods=['GET'])
@jwt_required()
def get_consultations():
    """Get user's consultations"""
    try:
        user_id = get_jwt_identity()
        
        consultations = Consultation.query.filter_by(user_id=user_id)\
            .order_by(Consultation.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'data': [c.to_dict() for c in consultations]
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to get consultations: {str(e)}'
        }), 500


@faq_bp.route('/consultations', methods=['POST'])
@jwt_required()
def create_consultation():
    """Create new consultation"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('subject') or not data.get('pertanyaan'):
            return jsonify({
                'success': False,
                'message': 'Subject and pertanyaan are required'
            }), 400
        
        consultation = Consultation(
            user_id=user_id,
            subject=data['subject'],
            pertanyaan=data['pertanyaan'],
            priority=data.get('priority', 'normal')
        )
        
        db.session.add(consultation)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Consultation submitted successfully',
            'data': consultation.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to create consultation: {str(e)}'
        }), 500


@faq_bp.route('/consultations/<int:consultation_id>/answer', methods=['POST'])
@jwt_required()
def answer_consultation(consultation_id):
    """Answer a consultation (admin only)"""
    try:
        admin_id = get_jwt_identity()
        consultation = Consultation.query.get(consultation_id)
        
        if not consultation:
            return jsonify({
                'success': False,
                'message': 'Consultation not found'
            }), 404
        
        data = request.get_json()
        
        if not data.get('jawaban'):
            return jsonify({
                'success': False,
                'message': 'Jawaban is required'
            }), 400
        
        consultation.jawaban = data['jawaban']
        consultation.answered_by = admin_id
        consultation.answered_at = datetime.utcnow()
        consultation.status = 'answered'
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Consultation answered successfully',
            'data': consultation.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to answer consultation: {str(e)}'
        }), 500
